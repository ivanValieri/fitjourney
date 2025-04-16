export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("API Key ausente no ambiente.");
    }

    const { messages, model, max_tokens, temperature, top_p, stream } = JSON.parse(event.body);

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

    const text = await response.text(); // 🔍 Troca pra .text() pra logar se for erro HTML

    if (!response.ok) {
      console.error("Erro da OpenRouter:", text);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Erro da OpenRouter", detail: text }),
      };
    }

    return {
      statusCode: 200,
      body: text,
    };
  } catch (error) {
    console.error("Erro geral na função serverless:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Erro interno desconhecido" }),
    };
  }
}
