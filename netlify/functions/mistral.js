// netlify/functions/mistral.js

export default async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const apiKey = process.env.OPENROUTER_API_KEY;
    const { messages, model, max_tokens, temperature, top_p, stream } = req.body;
  
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
      return res.status(response.status).json(data);
    } catch (error) {
      console.error("Erro na função serverless:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  };
  