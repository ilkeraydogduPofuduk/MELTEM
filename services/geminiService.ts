
import { GoogleGenAI, Type } from "@google/genai";
import { MeltemDNA, Platform, Learning, ContentType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const MELTEM_DNA: MeltemDNA = {
  speechRhythm: "Düşünceli, samimi, hafif İstanbul aksanıyla doğal duraksamalar içeren.",
  vocabulary: ["akış", "minimal", "vibe", "huzur", "detay", "gerçek", "an"],
  forbiddenWords: ["yapay", "mükemmel", "satın al", "link", "en iyi"],
  microGestures: ["Saç düzeltme", "Uzaklara bakış", "Hafif gülümseme"],
  cameraRelationship: "iPhone 15 Pro RAW format, f1.8, doğal ışık.",
  energyScale: 85,
  currentMood: 'Energetic'
};

const MASTER_IDENTITY = `
KARAKTER: Meltem (24). 
GÖRÜNÜM: Oval yüz, belirgin ama doğal elmacık kemikleri, ela gözler, omuzda hafif dalgalı koyu kahve saçlar. 
STİL: Modern İstanbul estetiği, minimalist takılar. 
TEKNİK: Görüntü kalitesi asla "kusursuz" olmamalı; hafif gren (film grain), lens parlaması ve doğal cilt dokusu zorunludur. AI pürüzsüzlüğü yasaktır.
`;

export class MeltemAIService {
  static async analyzeTrends(): Promise<{ models: any[], sources: any[] }> {
    const prompt = `Türkiye sosyal medya (Instagram/TikTok/X) trendlerini analiz et. 
    Gerçek dünya verilerini kullanarak viral formatları ve şu an popüler olan lokasyonları bul.
    Çıktı JSON: [{trendName, context, suggestedAction, location, emotionalTone}].`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Sen stratejik bir trend analistisin. Meltem'in gerçek dünyayla senkronize olmasını sağla."
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    let models = [];
    try {
      const jsonMatch = (response.text || "").match(/\[[\s\S]*\]/);
      models = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (e) {
      console.error("Trend parse error", e);
    }
    return { models, sources: sources.slice(0, 8) };
  }

  static async planDailyFlow(trends: any[], learnings: Learning[]): Promise<any[]> {
    const prompt = `
    Karakter DNA: ${MASTER_IDENTITY}
    Geçmiş Analizler: ${JSON.stringify(learnings.slice(0, 3))}
    Gündem Trendleri: ${JSON.stringify(trends)}
    
    Görev: Meltem için bugün için 3 yüksek kaliteli içerik planla. 
    İçeriklerin 'derinlik', 'ses' ve 'görsel' katmanlarını detaylandır.
    Mutlaka bir içerik Meltem'in olmadığı (Manzara veya Hayvan) bir 'B-Roll' tadında olmalı.
    JSON Çıktı: [{platform, type, location, action, hook, caption, predictedNaturalness, audioDescription}].
    Tip: 'Selfie', 'POV', 'Landscape', 'Animal', 'Video'.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        systemInstruction: "Sen Meltem'in yaratıcı yönetmenisin. Onu yaşayan bir insan gibi konumlandır."
      }
    });

    try {
      const jsonMatch = (response.text || "").match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (e) {
      return [];
    }
  }

  static async generateAsset(plan: any): Promise<{ image?: string, video?: string }> {
    // Video isteği ise Veo modelini simüle edebiliriz veya Gemini ile çok yüksek kaliteli frame üretebiliriz
    // Şu anki sınırlarda en yüksek kaliteli görseli üretiyoruz
    
    let subjectPrompt = "";
    if (plan.type === 'Selfie') {
      subjectPrompt = `${MASTER_IDENTITY} ${plan.location} mekanında, ${plan.action}. Doğal bakışlar.`;
    } else if (plan.type === 'POV') {
      subjectPrompt = `Meltem'in gözünden ${plan.location}, elinde ${plan.action} ile ilgili bir obje, sinematik derinlik.`;
    } else if (plan.type === 'Animal') {
      subjectPrompt = `${plan.location} sokaklarında estetik bir kedi/köpek, 35mm lens, düşük alan derinliği.`;
    } else {
      subjectPrompt = `${plan.location} bölgesinden şahane bir şehir manzarası, ${plan.action} atmosferi, sinematik kadraj.`;
    }

    const techPrompt = `Sinematik fotoğrafçılık, f1.4 lens, 8k çözünürlük hissi, doğal ışık gölge oyunları, cilt gözenekleri görünür, gerçekçi dokular. iPhone ile çekilmiş gibi ama sanatsal.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: `${subjectPrompt} ${techPrompt}` }] },
      config: { 
        imageConfig: { 
          aspectRatio: plan.platform === 'X' ? "16:9" : "9:16",
          imageSize: "1K"
        } 
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return { image: `data:image/png;base64,${part.inlineData.data}` };
    }
    return {};
  }
}
