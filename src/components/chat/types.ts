
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
