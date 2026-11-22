import type { ExposureStop } from './types';

export interface ExposureDef {
  stop: ExposureStop;
  /** 버튼에 찍히는 표기 (+2, 0, −1 …) */
  mark: string;
  label: string;
  /** 인화지 톤 */
  paper: string;
  ink: string;
}

export const EXPOSURES: readonly ExposureDef[] = [
  { stop: 2, mark: '+2', label: '눈부신 하루', paper: '#FFFDF8', ink: '#3A2C26' },
  { stop: 1, mark: '+1', label: '밝은 하루', paper: '#E8DCC8', ink: '#3A2C26' },
  { stop: 0, mark: '0', label: '적당한 하루', paper: '#B9A68C', ink: '#3A2C26' },
  { stop: -1, mark: '−1', label: '어둑한 하루', paper: '#6E5A48', ink: '#F7F6F2' },
  { stop: -2, mark: '−2', label: '깜깜한 하루', paper: '#3A2C26', ink: '#F7F6F2' },
];

export function exposureOf(stop: ExposureStop | null): ExposureDef | null {
  if (stop === null) return null;
  return EXPOSURES.find((e) => e.stop === stop) ?? null;
}
