import { fadeFilter, fromDateKey, weekdayShortEn, type DateKey } from '@fade/core';
import type { WeekDay } from './types';
import styles from './ContactSheet.module.css';

interface Props {
  days: WeekDay[];
  bestDate: DateKey | null;
  onPick: (date: DateKey) => void;
}

function Frame({ day, best, onPick }: { day: WeekDay; best: boolean; onPick: (d: DateKey) => void }) {
  const photo = day.entry?.photos.find((p) => p.developed) ?? day.entry?.photos[0];
  const dayNum = fromDateKey(day.date).getDate();
  const label = `${weekdayShortEn(day.date)} ${dayNum}일`;

  return (
    <button
      type="button"
      className={styles.frame}
      onClick={() => onPick(day.date)}
      aria-pressed={best}
      aria-label={`${label}을 이번 주의 한 컷으로 고르기`}
      disabled={!photo}
    >
      {photo ? (
        <img src={photo.src} alt="" style={{ filter: fadeFilter(day.fade) }} />
      ) : (
        <span className={styles.blank}>{day.isFuture ? '' : '—'}</span>
      )}
      {best && (
        <svg aria-hidden="true" viewBox="0 0 120 100" className={styles.grease}>
          <path
            d="M60 6 C100 4 116 30 112 54 C108 82 78 96 50 94 C20 92 4 70 8 46 C12 18 40 4 70 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}

function Strip({ days, bestDate, onPick, tilt }: Props & { tilt: number }) {
  // 한 줄에 4칸. 남는 칸은 빈 필름(리더)으로 채운다
  const slots: (WeekDay | null)[] = [...days, ...Array<null>(Math.max(0, 4 - days.length)).fill(null)];

  return (
    <div className={styles.strip} style={{ transform: `rotate(${tilt}deg)` }}>
      <div aria-hidden="true" className={styles.sprockets} />
      <div className={styles.row}>
        {slots.map((d, i) =>
          d ? (
            <Frame key={d.date} day={d} best={d.date === bestDate} onPick={onPick} />
          ) : (
            <span key={`leader-${i}`} aria-hidden="true" className={styles.leader} />
          ),
        )}
      </div>
      <div className={styles.row}>
        {slots.map((d, i) => (
          <span key={d?.date ?? `edge-${i}`} className={styles.edge}>
            {d ? `▸ ${fromDateKey(d.date).getDate()}${d.entry?.transcribedAt ? ' · 옮김' : ''}` : '▸ —'}
          </span>
        ))}
      </div>
      <div aria-hidden="true" className={styles.sprockets} />
    </div>
  );
}

export function ContactSheet({ days, bestDate, onPick }: Props) {
  return (
    <div className={styles.sheet}>
      <div className={styles.head}>
        <span>CONTACT SHEET</span>
        <span>사진을 눌러 이번 주의 한 컷 고르기</span>
      </div>
      <div className={styles.strips}>
        <Strip days={days.slice(0, 4)} bestDate={bestDate} onPick={onPick} tilt={-0.6} />
        <Strip days={days.slice(4)} bestDate={bestDate} onPick={onPick} tilt={0.5} />
      </div>
    </div>
  );
}
