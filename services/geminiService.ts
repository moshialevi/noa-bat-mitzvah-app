import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API client with the stable SDK
// Note: Ensure REACT_APP_API_KEY or VITE_API_KEY or API_KEY is set in your Vercel Environment Variables
const API_KEY = process.env.API_KEY || ''; 
const genAI = new GoogleGenerativeAI(API_KEY);

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

    // Use the stable 'gemini-1.5-flash' model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || "לא הצלחתי ליצור ברכה כרגע, נסה שוב.";
  } catch (error) {
    console.error("Error generating blessing:", error);
    return "אירעה שגיאה ביצירת הברכה. אנא ודא שהגדרת API Key.";
  }
};