// src/api/mistral.ts
const isProd = import.meta.env.MODE === "production";
const API_URL = isProd
  ? "https://api.openrouter.ai/api/v1/chat/completions"
  : "/api/v1/chat/completions";

const APP_URL = "https://fitjourney-app-git-main-ivans-projects-65cdd8ca.vercel.app";

export const askMistral = async (prompt: string): Promise<string> => {
  console.log("=== INICIANDO REQUISIÇÃO OPENROUTER ===");
  console.log("Ambiente:", import.meta.env.MODE);
  console.log("URL Base:", API_URL);
  console.log("App URL:", APP_URL);
  
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
  if (!apiKey) {
    console.error("API Key não encontrada no ambiente:", import.meta.env);
    throw new Error("API Key não encontrada");
  }
  console.log("API Key presente:", !!apiKey);
  
  try {
    const requestBody = {
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{
        role: "system",
        content: "Você é um personal trainer profissional especializado em fitness e nutrição. Forneça respostas detalhadas e personalizadas sobre exercícios, nutrição e bem-estar, mantendo um tom profissional e motivador."
      }, {
        role: "user",
        content: prompt
      }],
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.95,
      stream: false
    };
    
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": APP_URL,
      "X-Title": "FitJourney"
    };

    console.log("[ENVIANDO REQUISIÇÃO]", {
      ambiente: import.meta.env.MODE,
      isProd,
      url: API_URL,
      method: "POST",
      headers: { 
        ...headers, 
        Authorization: "Bearer [REDACTED]" 
      },
      body: requestBody
    });

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        requestInfo: {
          ambiente: import.meta.env.MODE,
          isProd,
          url: response.url,
          method: "POST",
          headers: Object.fromEntries(response.headers.entries())
        }
      };
      console.error("[ERRO NA API]", errorDetails);

      if (response.status === 401) {
        console.error("[ERRO 401] Detalhes:", {
          apiKeyPresente: !!apiKey,
          headers: headers
        });
        return "Erro de autenticação. Por favor, verifique as configurações da API.";
      }

      if (response.status === 402) {
        return "Créditos insuficientes na conta OpenRouter. Por favor, adicione mais créditos em https://openrouter.ai/settings/credits";
      }

      if (response.status === 405) {
        console.error("[ERRO 405 DETALHADO]", {
          ambiente: import.meta.env.MODE,
          isProd,
          requestUrl: API_URL,
          requestHeaders: headers,
          responseHeaders: Object.fromEntries(response.headers.entries())
        });
        return "Erro de método HTTP. Por favor, aguarde alguns instantes e tente novamente.";
      }

      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("[RESPOSTA]", data);
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("[ERRO NO FORMATO]", data);
      throw new Error("Formato de resposta inválido");
    }

    return data.choices[0].message.content;

  } catch (error: any) {
    console.error("[ERRO DETALHADO]", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      request: { prompt },
      ambiente: import.meta.env.MODE,
      isProd,
      timestamp: new Date().toISOString()
    });

    return `Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente. (${error.message})`;
  }
};