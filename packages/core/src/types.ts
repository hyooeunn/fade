/** 'YYYY-MM-DD' 형태의 로컬 날짜 키 */
export type DateKey = string;

/** 오늘의 노출(기분). +2 눈부심 ~ -2 깜깜함 */
export type ExposureStop = 2 | 1 | 0 | -1 | -2;

export interface Todo {
  id: string;
  text: string;
  done: boolean;
}

export interface Photo {
  id: string;
  /** 축소·압축된 이미지 data URL (추후 스토리지 URL로 교체) */
  src: string;
  caption: string;
  /** 네거티브 상태에서 현상했는지 */
  developed: boolean;
  createdAt: string;
}

export interface Reflection {
  good: string;
  regret: string;
  toTomorrow: string;
}

export interface Entry {
  date: DateKey;
  title: string;
  body: string;
  exposure: ExposureStop | null;
  todos: Todo[];
  photos: Photo[];
  reflection: Reflection;
  /** 오늘을 정착한 시각. 정착하면 바래는 속도가 절반이 된다 */
  fixedAt: string | null;
  /** 종이 다이어리에 손으로 옮겨 쓴 시각. 옮기면 더 이상 바래지 않는다 */
  transcribedAt: string | null;
  updatedAt: string;
}

export interface WeekNote {
  /** 그 주 월요일의 DateKey */
  weekStart: DateKey;
  keywords: string;
  bestMoment: string;
  toNextWeek: string;
  /** 이번 주의 한 컷으로 고른 날 */
  bestDate: DateKey | null;
  updatedAt: string;
}
