
import { UpgradeResult } from "../types";

const STORAGE_KEY = 'doodle_english_cards';

export function saveCard(card: UpgradeResult) {
  const existing = getCards();
  const updated = [card, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getCards(): UpgradeResult[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function deleteCard(id: string) {
  const existing = getCards();
  const updated = existing.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
