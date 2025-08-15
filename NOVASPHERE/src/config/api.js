
import { GoogleGenAI } from '@google/genai';

export async function getResponse(input, onChunk) {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  const tools = [{ googleSearch: {} }];

  const config = {
    thinkingConfig: { thinkingBudget: -1 },
    tools,
  };

  const model = 'gemini-2.5-pro';

  const contents = [
  {
    role: "model",
    parts: [{ text: "You are a helpful assistant." }],
  },
  {
    role: "user",
    parts: [{ text: input }],
  },
];


  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullText = '';

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      const chunkText = parts?.[0]?.text;
      if (chunkText) {
        fullText += chunkText;
        if (onChunk) onChunk(fullText);
      }
    }

    return fullText;

  } catch (error) {
    console.error("Gemini API error:", error);
    alert("❌ An error occurred while fetching the response.");
    return null;
  }
}
