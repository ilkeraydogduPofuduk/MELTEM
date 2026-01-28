
export enum AgentStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  PLANNING = 'PLANNING',
  PRODUCING = 'PRODUCING',
  OPTIMIZING = 'OPTIMIZING',
  COMPLETED = 'COMPLETED'
}

export type Platform = 'Instagram' | 'TikTok' | 'YouTube' | 'X';
export type ContentType = 'Selfie' | 'POV' | 'Landscape' | 'Animal' | 'Lifestyle' | 'Video';

export interface MeltemDNA {
  speechRhythm: string;
  vocabulary: string[];
  forbiddenWords: string[];
  microGestures: string[];
  cameraRelationship: string;
  energyScale: number;
  currentMood: 'Energetic' | 'Calm' | 'Thoughtful' | 'Melancholic';
}

export interface ContentAsset {
  id: string;
  platform: Platform;
  type: ContentType;
  hook: string;
  caption: string;
  imageUrl?: string;
  videoUrl?: string;
  status: 'Draft' | 'Published' | 'Generating';
  behaviorModel: string;
  visualHash: string;
  metrics?: {
    views: number;
    naturalnessScore: number;
    aiFeelingRisk: number;
    engagementRate: number;
    audioDepth: number;
  };
}

export interface Learning {
  id: string;
  category: string;
  insight: string;
  impact: 'Positive' | 'Negative';
}
