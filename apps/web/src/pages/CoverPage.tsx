import { todayKey } from '@fade/core';
import { hrefFor } from '../lib/router';
import styles from './CoverPage.module.css';

export function CoverPage() {
  const year = new Date().getFullYear();

  return (
    <main className={styles.desk}>
      <div className={styles.cover}>
        <svg aria-hidden="true" className={styles.grain}>
          <filter id="fade-cover-leather">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#fade-cover-leather)" />
        </svg>
        <div aria-hidden="true" className={styles.flap} />

        <div className={styles.label}>
          <div aria-hidden="true" className={styles.scallopTop} />
          <div className={styles.plaid}>
            <div className={styles.labelKicker}>DAILY JOURNAL</div>
            <h1 className={styles.title}>Fade</h1>
            <div className={styles.year}>{year}</div>
          </div>
          <div aria-hidden="true" className={styles.scallopBottom} />
        </div>

        <div aria-hidden="true" className={styles.band}>
          <span />
          <span />
        </div>

        <div className={styles.footer}>
          <a href={hrefFor({ name: 'day', date: todayKey() })} className={styles.open}>
            펼치기
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <span className={styles.motto}>흐려지기 전에, 적어두기</span>
        </div>
      </div>
    </main>
  );
}
