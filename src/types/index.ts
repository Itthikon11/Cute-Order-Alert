export interface SoundPreset {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  badgeColor: string;
  text: string;
  chimeType: 'bell' | 'cash' | 'pop' | 'dingdong' | 'coin' | 'marimba' | 'none';
  voiceStyle: string;
  voiceName: 'Aoede' | 'Kore' | 'Zephyr' | 'Puck';
  pitch: number; // 0.8 to 1.4
  speed: number; // 0.8 to 1.3
  reverb: boolean;
  introDelay: number; // seconds
  description: string;
  sampleAudioUrl?: string;
}

export interface VoiceGenerationOptions {
  text: string;
  voiceName: 'Aoede' | 'Kore' | 'Zephyr' | 'Puck';
  style: string;
  chimeType: 'bell' | 'cash' | 'pop' | 'dingdong' | 'coin' | 'marimba' | 'none';
  pitch: number;
  speed: number;
  reverb: boolean;
  chimeVolume: number;
  voiceVolume: number;
  introDelay: number;
}

export interface VoiceCharacter {
  id: 'Aoede' | 'Kore' | 'Zephyr' | 'Puck';
  title: string;
  tag: string;
  avatar: string;
  desc: string;
  defaultPitch: number;
  defaultSpeed: number;
  stylePrompt: string;
  samplePhrase: string;
}

export interface MockOrder {
  id: string;
  app: 'lineman' | 'grab' | 'shopee' | 'tiktok' | 'robinhood';
  appName: string;
  orderNumber: string;
  customerName: string;
  items: string[];
  total: number;
  timeAgo: string;
}
