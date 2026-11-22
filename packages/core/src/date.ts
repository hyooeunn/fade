import type { DateKey } from './types';

const pad = (n: number) => String(n).padStart(2, '0');

export function toDateKey(d: Date): DateKey {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromDateKey(key: DateKey): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): DateKey {
  return toDateKey(new Date());
}

export function addDays(key: DateKey, n: number): DateKey {
  const d = fromDateKey(key);
  d.setDate(d.getDate() + n);
  return toDateKey(d);
}

/** b - a 를 일 단위로 (로컬 자정 기준) */
export function daysBetween(a: DateKey, b: DateKey): number {
  const ms = fromDateKey(b).getTime() - fromDateKey(a).getTime();
  return Math.round(ms / 86_400_000);
}

/** 그 주 월요일 */
export function startOfWeek(key: DateKey): DateKey {
  const day = fromDateKey(key).getDay(); // 0=일
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(key, diff);
}

/** 월요일부터 일요일까지 7일 */
export function weekDays(key: DateKey): DateKey[] {
  const start = startOfWeek(key);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** ISO 8601 주차 */
export function isoWeek(key: DateKey): number {
  const d = fromDateKey(key);
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayNr = (target.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const diff = target.getTime() - firstThursday.getTime();
  return 1 + Math.round((diff / 86_400_000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7);
}

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS_EN = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

/** "November 23" */
export function formatLongEn(key: DateKey): string {
  const d = fromDateKey(key);
  return `${MONTHS_EN[d.getMonth()]} ${d.getDate()}`;
}

/** "MONDAY" */
export function weekdayEn(key: DateKey): string {
  return WEEKDAYS_EN[fromDateKey(key).getDay()];
}

/** "MON" */
export function weekdayShortEn(key: DateKey): string {
  return weekdayEn(key).slice(0, 3);
}

/** "11.23" */
export function formatMonthDay(key: DateKey): string {
  const d = fromDateKey(key);
  return `${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

/** "23:58" */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
