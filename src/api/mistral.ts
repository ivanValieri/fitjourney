// src/api/mistral.ts
export const askMistral = async (prompt: string): Promise<string> => {
  console.log("=== INICIANDO REQUISIÇÃO MISTRAL ===");
  
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
    
    console.log("[ENVIANDO REQUISIÇÃO]", {
      body: requestBody
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`,
        "HTTP-Referer": "https://fitjourney-app.vercel.app",
        "X-Title": "FitJourney",
        "Origin": "https://fitjourney-app.vercel.app"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ERRO NA API]", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      if (response.status === 401) {
        return "Erro de autenticação. Por favor, verifique as configurações da API.";
      }

      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
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