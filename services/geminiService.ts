import { GoogleGenAI, Type } from "@google/genai";
import { DietPlan } from "../types";

// Initialize Gemini API
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is not defined in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build-check' });

export const generateDietPlan = async (ailment: string): Promise<DietPlan> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure the environment.");
  }

  const model = "gemini-2.5-flash";

  const schema = {
    type: Type.OBJECT,
    properties: {
      ailment: { type: Type.STRING, description: "The normalized name of the ailment" },
      sanskritName: { type: Type.STRING, description: "The Ayurvedic/Sanskrit name for the ailment if applicable" },
      explanation: { 
        type: Type.STRING, 
        description: "A clear, easy-to-understand explanation integrating both Ayurvedic concepts (Doshas like Vata, Pitta, Kapha) and Naturopathic principles (accumulation of toxins/morbid matter, vitality). Explain WHY this ailment happens according to these systems." 
      },
      foodsToEat: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of 5-7 distinct foods or categories beneficial for this condition, agreed upon by both Ayurveda and Naturopathy (e.g., alkaline foods, specific herbs)."
      },
      foodsToAvoid: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of 5-7 distinct foods or categories detrimental for this condition (e.g., acidic foods, processed items)."
      },
      lifestyleTips: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 brief lifestyle habits that support healing (e.g., sun bathing, yoga, sleep hygiene, hydrotherapy)."
      },
      recipes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING, description: "A very short enticing description." },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            prepTime: { type: Type.STRING, description: "e.g., '15 mins'" },
            benefits: { type: Type.STRING, description: "Why this recipe helps the ailment." }
          },
          required: ["name", "description", "ingredients", "instructions", "prepTime", "benefits"]
        },
        description: "3 simple, easy-to-prepare vegetarian recipes using the prescribed foods."
      }
    },
    required: ["ailment", "explanation", "foodsToEat", "foodsToAvoid", "lifestyleTips", "recipes"]
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Provide a holistic diet plan combining Naturopathy and Ayurveda for: "${ailment}". Ensure the explanation covers both perspectives (Ayurvedic Doshas and Naturopathic Toxins/Vitality) in a simple, integrated way.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are an expert Holistic Health Practitioner specializing in the integration of Ayurveda and Naturopathy. Your goal is to treat the root cause of ailments using food as medicine. Your tone is empathetic, clear, and educational. When explaining conditions, simplify complex terms. For recipes, focus on ingredients that satisfy both systems (e.g., easy to digest, whole, natural).",
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No content generated");
    }

    return JSON.parse(text) as DietPlan;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate diet plan. Please try again later.");
  }
};

export const generateRecipeImage = async (recipeName: string, description: string): Promise<string | null> => {
  if (!apiKey) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Generate a photorealistic, appetizing professional food photography shot of this dish: ${recipeName}. Context: ${description}. High resolution, 4k, cinematic soft lighting, shallow depth of field.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3",
        },
      },
    });

    // Iterate through candidates and parts to find the image data
    const candidates = response.candidates;
    if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
};