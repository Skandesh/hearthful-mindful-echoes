
export interface Message {
  type: 'user' | 'ai';
  content: string;
  audio?: string;
  timestamp?: Date;
}

export interface UserAffirmation {
  id: string;
  user_id: string;
  affirmation: string;
  is_favorite: boolean;
  created_at: string;
}

export interface AffirmationSession {
  isActive: boolean;
  currentAffirmation: string;
  affirmations: string[];
  index: number;
  isFullscreen?: boolean;
}

export interface UserPlan {
  id: string;
  user_id: string;
  plan_type: 'free' | 'pro' | 'premium';
  affirmations_limit: number;
  affirmations_used: number;
  created_at: string;
  updated_at: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  description?: string;
  premium?: boolean;
}

export interface AudioOptions {
  voiceId: string;
  backgroundMusic?: boolean;
}

export interface PremiumFeature {
  type: 'voice' | 'music' | 'language' | 'duration';
  available: boolean;
  upgradeMessage: string;
}

export interface AuthState {
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
}
