import { fadeFilter, formatMonthDay } from '@fade/core';
import type { WeekDay } from './types';
import styles from './BestShot.module.css';

export function BestShot({ day }: { day: WeekDay | undefined }) {
  const photo = day?.entry?.photos.find((p) => p.developed) ?? day?.entry?.photos[0];

  return (
    <div className={styles.wrap}>
      <figure className={styles.polaroid}>
        {photo && day ? (
          <img src={photo.src} alt="이번 주의 한 컷" style={{ filter: fadeFilter(day.fade) }} />
        ) : (
          <span className={styles.empty}>
            사진이 있는 날을
            <br />
            골라 주세요
          </span>
        )}
        <figcaption>이번 주의 한 컷{day ? ` · ${formatMonthDay(day.date)}` : ''}</figcaption>
      </figure>

      <div className={styles.legend}>
        <div className={styles.legendRow}>
          <span aria-hidden="true" className={styles.swatch} />
          손으로 옮겨 쓴 날 · 선명하게 남아요
        </div>
        <div className={styles.legendRow}>
          <span aria-hidden="true" className={`${styles.swatch} ${styles.swatchFaded}`} />
          아직 안 옮긴 날 · 조금씩 바래요
        </div>
      </div>
    </div>
  );
}
