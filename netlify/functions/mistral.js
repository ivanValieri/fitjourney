// netlify/functions/mistral.js

export const handler = async (event) => {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" })
      };
    }
  
    const apiKey = process.env.OPENROUTER_API_KEY;
    const body = JSON.parse(event.body || "{}");
    const { messages, model, max_tokens, temperature, top_p, stream } = body;
  
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://fitjourney-pro.netlify.app",
          "X-Title": "FitJourney"
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens,
          temperature,
          top_p,
          stream
        })
      });
  
      const data = await response.json();
      return {
        statusCode: response.status,
        body: JSON.stringify(data)
      };
    } catch (error) {
      console.error("Erro na função serverless:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Erro interno do servidor" })
      };
    }
  };
  