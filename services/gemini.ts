
import { GoogleGenAI, Type } from "@google/genai";
import { UpgradeResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function upgradeEnglish(input: string): Promise<UpgradeResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Input: "${input}"`,
      config: {
        systemInstruction: `You are an editorial English consultant.
        Objective: Transform user ideas (Chinese or English) into high-quality, clear communications.
        
        1. "AcknowledgedMeaning": Simple, warm Chinese validation.
        2. "Clear": Most natural, direct English version.
        3. "Business": Professional, polite, suitable for Slack/Email.
        4. "IELTS": Band 7.5+ style, using sophisticated cohesion and vocabulary.
        5. "Patterns": 2 key reusable structural formulas.
        6. "FeynmanChallenge": A brief prompt asking the user to synthesize what they learned.

        Respond strictly in JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            acknowledgedMeaning: { type: Type.STRING },
            clear: { type: Type.STRING },
            business: { type: Type.STRING },
            ielts: { type: Type.STRING },
            patterns: { type: Type.ARRAY, items: { type: Type.STRING } },
            feynmanChallenge: { type: Type.STRING }
          },
          required: ["acknowledgedMeaning", "clear", "business", "ielts", "patterns", "feynmanChallenge"]
        }
      }
    });

    const data = JSON.parse(response.text.trim());
    return {
      ...data,
      id: crypto.randomUUID(),
      original: input,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
