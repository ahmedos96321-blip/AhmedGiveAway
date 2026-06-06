export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  points: number;
  level: 1 | 2 | 3;
  completedSurveysCount: number;
  completedDailyPollsCount: number;
  lastDailyPollTime: string | null; // ISO string
  lastSurveyTime: string | null; // ISO string
  hasAgreedToTerms: boolean;
  verificationCode: string;
}

export type SurveyType = 'location' | 'profile';

export interface Survey {
  id: string;
  type: SurveyType;
  questionText: string;
  pointsReward: number;
  options?: string[];
}

export interface PollResult {
  option: string;
  percentage: number;
  votesCount: number;
  color: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  codeInstruction?: string;
  pointsReward: number;
  requirements?: string;
  isActionAvailable: boolean;
}

export interface Competitor {
  id: string;
  name: string;
  points: number;
  avatar: string;
  active: boolean;
  level: number;
}
