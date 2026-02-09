import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBlessing = async (
  name: string,
  relationship: string,
  tone: string
): Promise<string> => {
  try {
    const prompt = `
      Write a short, heartwarming Bat Mitzvah blessing (greeting) in Hebrew.
      Target Name: ${name}
      From: ${relationship}
      Tone: ${tone}
      
      Keep it under 50 words. Make it personal and sweet.
      Do not include any English text, only Hebrew.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "לא הצלחתי ליצור ברכה כרגע, נסה שוב.";
  } catch (error) {
    console.error("Error generating blessing:", error);
    return "אירעה שגיאה ביצירת הברכה.";
  }
};