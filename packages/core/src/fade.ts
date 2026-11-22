import { daysBetween } from './date';
import type { DateKey, Entry } from './types';

/** 이 일수만큼 지나면 완전히 바랜다 */
export const FULL_FADE_DAYS = 14;

/**
 * 기록이 얼마나 바랬는지 0(선명) ~ 1(완전히 바램).
 * - 종이에 옮겨 쓴 날은 바래지 않는다.
 * - 정착한 날은 절반 속도로 바랜다.
 * - 오늘과 미래는 바래지 않는다.
 */
export function fadeLevel(
  entry: Pick<Entry, 'date' | 'fixedAt' | 'transcribedAt'>,
  today: DateKey,
): number {
  if (entry.transcribedAt) return 0;
  const age = daysBetween(entry.date, today);
  if (age <= 0) return 0;
  const speed = entry.fixedAt ? 0.5 : 1;
  return Math.min(1, (age * speed) / FULL_FADE_DAYS + 0.15);
}

/** 사진에 거는 CSS filter */
export function fadeFilter(level: number): string {
  if (level <= 0) return 'none';
  const k = Math.min(1, level);
  return [
    `saturate(${(1 - 0.8 * k).toFixed(2)})`,
    `brightness(${(1 + 0.35 * k).toFixed(2)})`,
    `contrast(${(1 - 0.4 * k).toFixed(2)})`,
  ].join(' ');
}

/** 글씨에 거는 흐림 정도(px) */
export function fadeBlur(level: number): number {
  return level <= 0 ? 0 : Number((0.15 + 0.5 * level).toFixed(2));
}
