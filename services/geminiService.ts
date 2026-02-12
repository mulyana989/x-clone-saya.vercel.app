
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Initialize AI
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export async function improveTweet(content: string) {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Improve this tweet for better engagement while keeping the same meaning. Return only the improved text without quotes: "${content}"`,
    });
    return response.text || content;
  } catch (error) {
    console.error("Improve Tweet Error:", error);
    return content;
  }
}

export async function getAITrends() {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 5 trending topics for a social media app called X. Use real current events. Return as JSON.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              category: { type: Type.STRING },
              topic: { type: Type.STRING },
              postCount: { type: Type.STRING },
            },
            required: ["id", "category", "topic", "postCount"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [
      { id: "1", category: "Trending", topic: "AI Evolution", postCount: "1.2M posts" },
      { id: "2", category: "Tech", topic: "Gemini 3 Pro", postCount: "450K posts" }
    ];
  }
}

/**
 * Mensimulasikan pencarian orang berdasarkan query menggunakan Gemini
 */
export async function searchPeople(query: string) {
  if (!query || query.length < 2) return [];
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 4 realistic but fictional social media profile results for the search query: "${query}". Include handle, name, and a very short bio. Return as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              handle: { type: Type.STRING },
              bio: { type: Type.STRING },
              verified: { type: Type.BOOLEAN }
            },
            required: ["id", "name", "handle", "bio", "verified"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}

export async function generateSpeech(text: string) {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this tweet naturally: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
}

export async function generateProImage(prompt: string, size: "1K" | "2K" | "4K", aspectRatio: string) {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { aspectRatio: aspectRatio as any, imageSize: size as any },
        tools: [{ googleSearch: {} }],
      },
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
}

export async function chatWithThinking(message: string, history: any[] = []) {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ googleSearch: {} }]
      },
    });
    return {
      text: response.text,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Chat Error:", error);
    return { text: "I'm having trouble thinking right now. Please try again." };
  }
}

export async function generateVideo(prompt: string, onStatus: (msg: string) => void) {
  const ai = getAI();
  try {
    onStatus("Starting video generation...");
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });
    return await pollVideoOperation(operation, onStatus);
  } catch (error: any) { throw error; }
}

export async function extendVideo(prompt: string, previousVideoUri: string, onStatus: (msg: string) => void) {
  const ai = getAI();
  try {
    onStatus("Extending video sequence...");
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-generate-preview',
      prompt: prompt,
      video: { uri: previousVideoUri },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });
    return await pollVideoOperation(operation, onStatus);
  } catch (error: any) { throw error; }
}

async function pollVideoOperation(operation: any, onStatus: (msg: string) => void) {
  const ai = getAI();
  while (!operation.done) {
    onStatus("Processing video frames...");
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }
  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return { url: URL.createObjectURL(blob), uri: downloadLink };
}
