
import { GoogleGenAI, Type } from "@google/genai";
import { SignLanguageOutput, TargetLanguage, SYSTEM_INSTRUCTIONS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function translateToSignLanguage(text: string, targetLanguage: TargetLanguage): Promise<SignLanguageOutput> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ 
        role: "user", 
        parts: [{ text: `Target Language: ${targetLanguage}\nInput Text: ${text}` }] 
      }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sign_language: { type: Type.STRING },
            gloss_sequence: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            facial_expressions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.NUMBER },
                  type: { type: Type.STRING },
                  intensity: { type: Type.NUMBER }
                },
                required: ["timestamp", "type", "intensity"]
              }
            },
            handshape_params: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sign: { type: Type.STRING },
                  dominant_hand: { type: Type.STRING },
                  location: { type: Type.STRING },
                  movement: { type: Type.STRING }
                },
                required: ["sign", "dominant_hand", "location", "movement"]
              }
            },
            emotion_register: { type: Type.STRING },
            duration_estimate_ms: { type: Type.NUMBER },
            pace: { type: Type.STRING },
            clarification_needed: { type: Type.STRING },
            error_context: { type: Type.STRING }
          },
          required: ["sign_language", "gloss_sequence", "facial_expressions", "handshape_params", "emotion_register", "duration_estimate_ms"]
        },
      },
    });

    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr);
  } catch (err: any) {
    console.error("Gemini Service Error:", err);
    throw new Error(err.message || "Failed to contact translation engine.");
  }
}
