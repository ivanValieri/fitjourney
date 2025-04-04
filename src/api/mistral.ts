// src/api/mistral.ts
const API_URL = "https://api.mistral.ai/v1/chat/completions";

export const askMistral = async (prompt: string): Promise<string> => {
  console.log("=== INICIANDO REQUISIÇÃO MISTRAL ===");
  console.log("Ambiente:", import.meta.env.MODE);
  console.log("API URL:", API_URL);
  
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
  if (!apiKey) {
    console.error("API Key não encontrada no ambiente:", import.meta.env);
    throw new Error("API Key não encontrada");
  }
  console.log("API Key presente:", !!apiKey);
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const requestBody = {
      model: "mistral-tiny",
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
      "Accept": "application/json"
    };

    console.log("Enviando requisição para:", API_URL);
    console.log("Headers:", headers);
    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    // Garantir que a URL seja absoluta
    const fullUrl = new URL(API_URL);
    console.log("URL completa:", fullUrl.toString());

    const response = await fetch(fullUrl.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeout);
    
    const responseText = await response.text();
    console.log("Raw response:", responseText);

    if (!response.ok) {
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        error: responseText,
        headers: Object.fromEntries(response.headers.entries())
      };
      console.error("[ERRO NA API]", errorDetails);

      if (response.status === 405) {
        console.error("[ERRO 405] Detalhes:", {
          url: fullUrl.toString(),
          method: "POST",
          headers: headers,
          body: requestBody
        });
        return "Erro de método HTTP. Por favor, verifique a configuração da API.";
      }

      if (response.status === 530 || response.status === 502) {
        return "O serviço está temporariamente indisponível. Por favor, tente novamente em alguns minutos.";
      }

      if (response.status === 401) {
        return "Erro de autenticação. Por favor, verifique as configurações da API.";
      }

      throw new Error(`Erro HTTP ${response.status}: ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("[ERRO NO PARSE]", error);
      throw new Error("Resposta inválida da API");
    }

    console.log("[RESPOSTA API]", {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data
    });

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

    if (error.name === "AbortError") {
      return "A requisição excedeu o tempo limite. Por favor, tente novamente.";
    }

    if (error.message.includes("Failed to fetch")) {
      return "Não foi possível conectar ao serviço. Por favor, verifique sua conexão e tente novamente.";
    }

    return `Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente. (${error.message})`;
  }
};