import { fadeBlur, oneLine, weekdayShortEn, fromDateKey, type DateKey } from '@fade/core';
import { hrefFor } from '../../lib/router';
import type { WeekDay } from './types';
import styles from './DayLines.module.css';

interface Props {
  days: WeekDay[];
  onToggleTranscribed: (date: DateKey) => void;
}

export function DayLines({ days, onToggleTranscribed }: Props) {
  return (
    <section aria-label="하루 한 줄" className={styles.list}>
      {days.map((d) => {
        const line = oneLine(d.entry);
        const moved = Boolean(d.entry?.transcribedAt);
        const faded = !moved && d.fade > 0;
        const label = `${weekdayShortEn(d.date)} ${fromDateKey(d.date).getDate()}`;

        return (
          <div key={d.date} className={styles.row}>
            <span className={styles.date}>{label}</span>
            <a
              href={hrefFor({ name: 'day', date: d.date })}
              className={`${styles.line} ${faded ? styles.faded : ''} ${!line ? styles.empty : ''}`}
              style={faded ? { filter: `blur(${fadeBlur(d.fade)}px)` } : undefined}
            >
              {line || (d.isFuture ? '' : '비어 있는 날')}
              {faded && <span className="sr-only"> (바래는 중)</span>}
            </a>
            {d.entry && !d.isFuture && (
              <button
                type="button"
                aria-pressed={moved}
                onClick={() => onToggleTranscribed(d.date)}
                className={`${styles.toggle} ${moved ? styles.toggleOn : ''}`}
              >
                {moved ? '옮김 ✓' : '옮겨 썼어요'}
              </button>
            )}
          </div>
        );
      })}
    </section>
  );
}
