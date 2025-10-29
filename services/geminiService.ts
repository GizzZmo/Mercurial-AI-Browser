import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { GroundingChunk } from '../types';

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set. The application cannot start.");
}

const ai = new GoogleGenAI({ apiKey });

export const analyzeUrlContent = async (url: string, instruction?: string): Promise<{ summary: string; sources: GroundingChunk[] }> => {
  try {
    const basePrompt = `Regarding the content at the URL: ${url}.`;
    const instructionPrompt = instruction 
      ? ` Please follow this specific instruction: "${instruction}".`
      : ` Provide a concise summary of the content, identifying key topics and main points.`;
    const prompt = basePrompt + instructionPrompt;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const summary = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const rawChunks = groundingMetadata?.groundingChunks || [];

    // The GroundingChunk type from the SDK has optional 'uri' and 'title'.
    // We filter for chunks that have a valid URI and map them to our stricter local type.
    const sources: GroundingChunk[] = rawChunks
      .filter(chunk => chunk.web?.uri)
      .map(chunk => ({
        web: {
          uri: chunk.web!.uri!,
          title: chunk.web!.title || chunk.web!.uri!,
        },
      }));
    
    return { summary, sources };
  } catch (error) {
    console.error("Error analyzing URL content:", error);
    let errorMessage = "Failed to analyze content. The AI core might be offline or the URL is inaccessible. ";
    if (error instanceof Error) {
        errorMessage += error.message;
    }
    return { summary: errorMessage, sources: [] };
  }
};

export const getPageTextContent = async (url: string, instruction?: string): Promise<{ text: string }> => {
  try {
    let prompt = `Extract the full text content from the main article or body of the URL: ${url}. Do not summarize it. Return only the text content. Do not add any introductory phrases like "Here is the text content:".`;

    if (instruction) {
      prompt = `From the URL ${url}, extract the text content based on the following instruction: "${instruction}". Do not summarize it. Return only the extracted text. Do not add any introductory phrases.`;
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const text = response.text;
    
    return { text };
  } catch (error) {
    console.error("Error fetching page text content:", error);
    let errorMessage = "Failed to fetch page content. The AI core might be offline or the URL is inaccessible. ";
    if (error instanceof Error) {
        errorMessage += error.message;
    }
    return { text: errorMessage };
  }
};