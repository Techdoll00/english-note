
import { GoogleGenAI, Type } from "@google/genai";
import { UpgradeResult } from "../types";
import { getMockUpgrade } from "./mock";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function upgradeEnglish(input: string): Promise<UpgradeResult> {
  if (!process.env.API_KEY || process.env.API_KEY === 'YOUR_API_KEY') {
    console.warn("API Key missing, using mock data.");
    return getMockUpgrade(input);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User Input Idea: "${input}"`,
      config: {
        systemInstruction: `You are an editorial English consultant. 
        Transform user ideas into three high-quality versions (Clear, Business, IELTS).
        
        Rules:
        1. "acknowledgedMeaning": Warm Chinese validation of the core idea.
        2. "clear": Natural, direct English.
        3. "business": Professional, polite, suitable for work context.
        4. "ielts": Band 7.5+ style (sophisticated vocab and cohesion).
        5. "patterns": 2-3 Structural Patterns (reusable thinking structures). 
           - Each pattern MUST have a "title", a "template" (reusable phrase), and a "note" (one-line Chinese usage guide).
        6. "feynmanChallenge": A brief prompt asking the user to re-express the idea simply.

        Return strictly JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            acknowledgedMeaning: { type: Type.STRING },
            clear: { type: Type.STRING },
            business: { type: Type.STRING },
            ielts: { type: Type.STRING },
            patterns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  template: { type: Type.STRING },
                  note: { type: Type.STRING }
                },
                required: ["title", "template", "note"]
              }
            },
            feynmanChallenge: { type: Type.STRING }
          },
          required: ["acknowledgedMeaning", "clear", "business", "ielts", "patterns", "feynmanChallenge"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    const data = JSON.parse(text.trim());
    return {
      ...data,
      id: crypto.randomUUID(),
      original: input,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return getMockUpgrade(input);
  }
}
