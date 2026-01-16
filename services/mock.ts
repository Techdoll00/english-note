
import { UpgradeResult } from "../types";

export function getMockUpgrade(input: string): UpgradeResult {
  // Simple deterministic generation based on input length or characters
  const isBusiness = input.toLowerCase().includes('work') || input.toLowerCase().includes('email') || input.toLowerCase().includes('client');
  const isIelts = input.toLowerCase().includes('think') || input.toLowerCase().includes('opinion') || input.toLowerCase().includes('believe');

  return {
    id: `mock-${Date.now()}`,
    original: input,
    acknowledgedMeaning: `我明白你想表达的是：${input}。这个想法很有价值。`,
    clear: `I just want to say that ${input.toLowerCase()}.`,
    business: `I am writing to inform you that ${input.toLowerCase()}, regarding our current objectives.`,
    ielts: `It is widely argued that ${input.toLowerCase()}, which plays a significant role in modern society.`,
    patterns: [
      { 
        title: "Clarifying Intention", 
        template: "What I really want to emphasize is...", 
        note: "用在你想纠正对方理解，或深入解释你的核心观点时。" 
      },
      { 
        title: "Stating Reasoning", 
        template: "The main reason behind this is...", 
        note: "用在商务谈判或写作中，给出一个清晰的逻辑支撑。" 
      }
    ],
    feynmanChallenge: "Can you explain this idea to a friend using only simple words?",
    timestamp: Date.now(),
    isOffline: true
  };
}
