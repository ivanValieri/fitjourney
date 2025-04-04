// src/api/mistral.ts
const API_URL = "https://api.mistral.ai/v1/chat/completions";
const APP_URL = "https://fitjourney-app-git-main-ivans-projects-65cdd8ca.vercel.app";

export const askMistral = async (prompt: string): Promise<string> => {
  console.log("=== INICIANDO REQUISIÇÃO MISTRAL ===");
  console.log("Ambiente:", import.meta.env.MODE);
  console.log("API URL:", API_URL);
  console.log("App URL:", APP_URL);
  
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
  if (!apiKey) {
    console.error("API Key não encontrada no ambiente:", import.meta.env);
    throw new Error("API Key não encontrada");
  }
  console.log("API Key presente:", !!apiKey);
  
  try {
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
      "Authorization": `Bearer ${apiKey}`
    };

    console.log("Enviando requisição para:", API_URL);
    console.log("Headers:", headers);
    console.log("Request body:", requestBody);

    // Fazer a requisição diretamente para a API do Mistral
    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Raw response:", errorText);
      
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        headers: Object.fromEntries(response.headers.entries())
      };
      console.error("[ERRO NA API]", errorDetails);

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