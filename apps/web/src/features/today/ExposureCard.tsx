import { EXPOSURES, exposureOf, type ExposureStop } from '@fade/core';
import styles from './ExposureCard.module.css';

interface Props {
  value: ExposureStop | null;
  onChange: (stop: ExposureStop) => void;
}

export function ExposureCard({ value, onChange }: Props) {
  const current = exposureOf(value);

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.kicker}>EXPOSURE</span>
        <span className={styles.sub}>오늘의 노출</span>
      </div>
      <div role="radiogroup" aria-label="오늘의 기분(노출)" className={styles.stops}>
        {EXPOSURES.map((e) => {
          const on = e.stop === value;
          return (
            <button
              key={e.stop}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={e.label}
              onClick={() => onChange(e.stop)}
              className={`${styles.stop} ${on ? styles.on : ''}`}
              style={{ background: e.paper, color: e.ink }}
            >
              {e.mark}
            </button>
          );
        })}
      </div>
      <div className={styles.line}>{current ? `오늘은, ${current.label}` : '오늘은 얼마나 밝았나요?'}</div>
      <div className={styles.blank} />
    </div>
  );
}
