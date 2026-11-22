import type { DateKey, Entry, WeekNote } from './types';

export function createEmptyEntry(date: DateKey): Entry {
  return {
    date,
    title: '',
    body: '',
    exposure: null,
    todos: [],
    photos: [],
    reflection: { good: '', regret: '', toTomorrow: '' },
    fixedAt: null,
    transcribedAt: null,
    updatedAt: new Date().toISOString(),
  };
}

export function createEmptyWeekNote(weekStart: DateKey): WeekNote {
  return {
    weekStart,
    keywords: '',
    bestMoment: '',
    toNextWeek: '',
    bestDate: null,
    updatedAt: new Date().toISOString(),
  };
}

/** 본문 글자 수 (공백 제외 아님, 줄바꿈만 제외) */
export function countChars(text: string): number {
  return text.replace(/\n/g, '').length;
}

/** 하루 한 줄: 제목이 있으면 제목, 없으면 본문 첫 줄 */
export function oneLine(entry: Entry | undefined): string {
  if (!entry) return '';
  if (entry.title.trim()) return entry.title.trim();
  return entry.body.split('\n').find((l) => l.trim())?.trim() ?? '';
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
