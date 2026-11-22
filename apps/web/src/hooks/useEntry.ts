import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { createEmptyEntry, createEmptyWeekNote, type DateKey, type Entry, type WeekNote } from '@fade/core';
import { getVersion, store, subscribe } from '../lib/storage';

export function useStoreVersion(): number {
  return useSyncExternalStore(subscribe, getVersion);
}

type Patch<T> = Partial<T> | ((prev: T) => T);

export function useEntry(date: DateKey) {
  const version = useStoreVersion();
  const entry = useMemo(
    () => store.getEntry(date) ?? createEmptyEntry(date),
    [date, version],
  );

  const update = useCallback(
    (patch: Patch<Entry>) => {
      const current = store.getEntry(date) ?? createEmptyEntry(date);
      const next = typeof patch === 'function' ? patch(current) : { ...current, ...patch };
      store.saveEntry(next);
    },
    [date],
  );

  return [entry, update] as const;
}

/** 여러 날짜를 한 번에 (주간 화면용). 기록이 없는 날은 undefined */
export function useEntries(dates: DateKey[]): Record<DateKey, Entry | undefined> {
  const version = useStoreVersion();
  const key = dates.join(',');
  return useMemo(() => {
    const out: Record<DateKey, Entry | undefined> = {};
    for (const d of dates) out[d] = store.getEntry(d);
    return out;
  }, [key, version]);
}

export function useWeekNote(weekStart: DateKey) {
  const version = useStoreVersion();
  const note = useMemo(
    () => store.getWeekNote(weekStart) ?? createEmptyWeekNote(weekStart),
    [weekStart, version],
  );
  const update = useCallback(
    (patch: Partial<WeekNote>) => {
      const current = store.getWeekNote(weekStart) ?? createEmptyWeekNote(weekStart);
      store.saveWeekNote({ ...current, ...patch });
    },
    [weekStart],
  );
  return [note, update] as const;
}
