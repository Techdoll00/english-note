
export type TabType = 'Quick' | 'IELTS' | 'Business' | 'Archive';

export interface UpgradeResult {
  id: string;
  original: string;
  acknowledgedMeaning: string;
  clear: string;
  business: string;
  ielts: string;
  patterns: string[];
  feynmanChallenge: string;
  timestamp: number;
}
