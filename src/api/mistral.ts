// src/api/mistral.ts
const API_URL = "/api/v1/chat/completions";
const APP_URL = "https://fitjourney-app-git-main-ivans-projects-65cdd8ca.vercel.app";

export const askMistral = async (prompt: string): Promise<string> => {
  console.log("=== INICIANDO REQUISIÇÃO OPENROUTER ===");
  console.log("URL Base:", API_URL);
  console.log("App URL:", APP_URL);
  
  if (!import.meta.env.VITE_MISTRAL_API_KEY) {
    throw new Error("API Key não encontrada");
  }
  
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
      "Authorization": `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`,
      "HTTP-Referer": APP_URL,
      "X-Title": "FitJourney",
      "OpenAI-Organization": "org-123abc"
    };

    console.log("[ENVIANDO REQUISIÇÃO]", {
      url: API_URL,
      headers: { ...headers, Authorization: "Bearer [REDACTED]" },
      body: requestBody
    });

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ERRO NA API]", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        requestInfo: {
          url: response.url,
          method: "POST",
          headers: Object.fromEntries(response.headers.entries())
        }
      });

      if (response.status === 401) {
        return "Erro de autenticação. Por favor, verifique as configurações da API.";
      }

      if (response.status === 402) {
        return "Créditos insuficientes na conta OpenRouter. Por favor, adicione mais créditos em https://openrouter.ai/settings/credits";
      }

      if (response.status === 405) {
        console.error("[ERRO 405 DETALHADO]", {
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
      timestamp: new Date().toISOString()
    });

    return `Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente. (${error.message})`;
  }
};