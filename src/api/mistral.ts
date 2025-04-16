// src/api/mistral.ts

export const askMistral = async (
  prompt: string,
  onStream?: (chunk: string) => void
): Promise<string> => {
  const MISTRAL_MODEL = import.meta.env.VITE_MISTRAL_MODEL || "mistralai/mistral-7b-instruct:free";

  const requestBody = {
    model: MISTRAL_MODEL,
    messages: [
      { role: "system", content: "Você é um personal trainer profissional..." },
      { role: "user", content: prompt }
    ],
    max_tokens: 800,
    temperature: 0.7,
    top_p: 0.95,
    stream: true
  };

  const response = await fetch("/.netlify/functions/mistral", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok || !response.body) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    const lines = chunk
      .split("\n")
      .filter(line => line.trim().startsWith("data: "));

    for (const line of lines) {
      const data = line.replace("data: ", "").trim();
      if (data === "[DONE]") continue;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          fullText += content;
          onStream?.(content); // callback com o novo pedaço
        }
      } catch (e) {
        console.warn("Erro no parsing do stream:", e);
      }
    }
  }

  return fullText;
};
