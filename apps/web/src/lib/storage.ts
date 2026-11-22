import type { DateKey, Entry, WeekNote } from '@fade/core';

/**
 * 지금은 브라우저 localStorage에만 저장한다.
 * 나중에 Supabase 동기화를 붙일 때 이 모듈의 구현만 바꾸면 된다.
 */
const ENTRY_PREFIX = 'fade:entry:';
const WEEK_PREFIX = 'fade:week:';

type Listener = () => void;
const listeners = new Set<Listener>();
let version = 0;

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getVersion(): number {
  return version;
}

function emit() {
  version += 1;
  listeners.forEach((l) => l());
}

function read<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

export class StorageFullError extends Error {
  constructor() {
    super('저장 공간이 가득 찼어요. 사진을 몇 장 지워 주세요.');
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      throw new StorageFullError();
    }
    throw e;
  }
  emit();
}

// 다른 탭에서 바뀐 내용도 반영
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key?.startsWith('fade:')) emit();
  });
}

export const store = {
  getEntry(date: DateKey): Entry | undefined {
    return read<Entry>(ENTRY_PREFIX + date);
  },
  saveEntry(entry: Entry): void {
    write(ENTRY_PREFIX + entry.date, { ...entry, updatedAt: new Date().toISOString() });
  },
  getWeekNote(weekStart: DateKey): WeekNote | undefined {
    return read<WeekNote>(WEEK_PREFIX + weekStart);
  },
  saveWeekNote(note: WeekNote): void {
    write(WEEK_PREFIX + note.weekStart, { ...note, updatedAt: new Date().toISOString() });
  },
};
