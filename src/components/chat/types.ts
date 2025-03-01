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
