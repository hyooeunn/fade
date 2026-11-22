import type { DateKey, Entry } from '@fade/core';

export interface WeekDay {
  date: DateKey;
  entry: Entry | undefined;
  /** 0(선명) ~ 1(완전히 바램) */
  fade: number;
  isFuture: boolean;
}
