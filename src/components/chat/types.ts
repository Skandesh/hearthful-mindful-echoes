
export type Message = {
  type: 'user' | 'ai';
  content: string;
  audio?: string;
};

export type AffirmationSession = {
  isActive: boolean;
  currentAffirmation: string;
  affirmations: string[];
  index: number;
};

export type UserAffirmation = {
  id: string;
  user_id: string;
  affirmation: string;
  created_at: string;
  is_favorite: boolean;
  plan_type: 'free' | 'pro' | 'premium';
};

export type UserPlan = {
  id: string;
  user_id: string;
  plan_type: 'free' | 'pro' | 'premium';
  affirmations_used: number;
  affirmations_limit: number;
  created_at: string;
  updated_at: string;
};
