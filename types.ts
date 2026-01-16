
export type TabType = 'Quick' | 'IELTS' | 'Business' | 'Archive';

export interface StructuralPattern {
  title: string;
  template: string;
  note: string;
}

export interface UpgradeResult {
  id: string;
  original: string;
  acknowledgedMeaning: string;
  clear: string;
  business: string;
  ielts: string;
  patterns: StructuralPattern[];
  feynmanChallenge: string;
  timestamp: number;
  isOffline?: boolean;
}
