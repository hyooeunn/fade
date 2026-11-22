import type { ReactNode } from 'react';
import type { DateKey } from '@fade/core';
import { hrefFor } from '../../lib/router';
import { Logo } from '../Logo/Logo';
import styles from './Binder.module.css';

export type BinderTab = 'today' | 'week';

interface Props {
  active: BinderTab;
  date: DateKey;
  leftLabel: string;
  rightLabel: string;
  left: ReactNode;
  right: ReactNode;
  /** 왼쪽 페이지 바탕: 회색 보드(오늘) / 밀착 인화지(한 주) */
  leftVariant?: 'board' | 'contact';
  /** 오른쪽 페이지 위의 클립보드 집게 */
  showClip?: boolean;
  headerActions?: ReactNode;
}

const RINGS = [0, 1, 2, 3, 4, 5];

export function Binder({
  active,
  date,
  leftLabel,
  rightLabel,
  left,
  right,
  leftVariant = 'board',
  showClip = false,
  headerActions,
}: Props) {
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <Logo />
        <div className={styles.actions}>
          {headerActions}
          <a href={hrefFor({ name: 'cover' })} className={styles.coverLink}>
            덮기
          </a>
        </div>
      </header>

      <div className={styles.binder}>
        <svg aria-hidden="true" className={styles.grain}>
          <filter id="fade-leather">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#fade-leather)" />
        </svg>

        <div className={styles.spread}>
          <section
            aria-label={leftLabel}
            className={`${styles.left} ${leftVariant === 'contact' ? styles.leftContact : styles.leftBoard}`}
          >
            {left}
          </section>

          <section aria-label={rightLabel} className={styles.right}>
            <div aria-hidden="true" className={styles.rings}>
              {RINGS.map((r) => (
                <svg key={r} width="46" height="20" viewBox="0 0 46 20">
                  <rect x="2" y="3" width="42" height="14" rx="7" fill="none" stroke="#B5B8BC" strokeWidth="3.4" />
                  <rect x="2" y="3" width="42" height="14" rx="7" fill="none" stroke="#E6E7E9" strokeWidth="1" strokeDasharray="20 60" />
                </svg>
              ))}
            </div>

            {showClip && (
              <svg aria-hidden="true" className={styles.clip} width="96" height="46" viewBox="0 0 96 46">
                <rect x="6" y="18" width="84" height="22" rx="4" fill="#C9CCD0" />
                <rect x="6" y="18" width="84" height="6" rx="3" fill="#E6E7E9" />
                <path d="M32 20 V6 a4 4 0 0 1 4 -4 h24 a4 4 0 0 1 4 4 V20" fill="none" stroke="#A7AAAF" strokeWidth="3" />
              </svg>
            )}

            <nav aria-label="장 넘기기" className={styles.tabs}>
              <a
                href={hrefFor({ name: 'day', date })}
                aria-current={active === 'today' ? 'page' : undefined}
                className={`${styles.tab} ${styles.tabToday} ${active === 'today' ? styles.tabActive : ''}`}
              >
                오늘
              </a>
              <a
                href={hrefFor({ name: 'week', date })}
                aria-current={active === 'week' ? 'page' : undefined}
                className={`${styles.tab} ${styles.tabWeek} ${active === 'week' ? styles.tabActive : ''}`}
              >
                한 주
              </a>
              <button type="button" disabled title="준비 중" className={`${styles.tab} ${styles.tabMonth}`}>
                한 달
              </button>
              <button type="button" disabled title="준비 중" className={`${styles.tab} ${styles.tabTranscribe}`}>
                옮겨 쓰기
              </button>
            </nav>

            {right}
          </section>
        </div>
      </div>
    </div>
  );
}
