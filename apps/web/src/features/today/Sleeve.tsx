import type { ReactNode } from 'react';
import { formatTime, type Photo } from '@fade/core';
import styles from './Sleeve.module.css';

/** 현상 전(네거티브) 상태 */
const NEGATIVE = 'invert(1) sepia(0.5) hue-rotate(180deg) contrast(0.85)';

interface Props {
  photos: Photo[];
  onToggleDevelop: (id: string) => void;
  /** 포켓 안에 같이 꽂아 둘 카드 (노출 카드 등) */
  children?: ReactNode;
}

export function Sleeve({ photos, onToggleDevelop, children }: Props) {
  const featured = photos[photos.length - 1];
  const strip = photos.slice(-5, -1).reverse();
  const empties = Math.max(0, 4 - strip.length);

  return (
    <div className={styles.sleeve}>
      <div className={styles.film}>
        <div className={styles.frames}>
          {strip.map((p) => (
            <button
              key={p.id}
              type="button"
              className={styles.frame}
              aria-label={`${formatTime(p.createdAt)} 사진 ${p.developed ? '네거티브로 되돌리기' : '현상하기'}`}
              onClick={() => onToggleDevelop(p.id)}
            >
              <img src={p.src} alt="" style={{ filter: p.developed ? 'none' : NEGATIVE }} />
            </button>
          ))}
          {Array.from({ length: empties }, (_, i) => (
            <span key={`empty-${i}`} aria-hidden="true" className={styles.emptyFrame} />
          ))}
        </div>
      </div>

      {featured ? (
        <button
          type="button"
          className={styles.polaroid}
          aria-pressed={featured.developed}
          aria-label={featured.developed ? '네거티브로 되돌리기' : '사진 현상하기'}
          onClick={() => onToggleDevelop(featured.id)}
        >
          <span className={styles.print}>
            <img src={featured.src} alt={featured.caption || '오늘의 사진'} style={{ filter: featured.developed ? 'none' : NEGATIVE }} />
          </span>
          <span className={styles.caption}>
            {featured.developed
              ? `${formatTime(featured.createdAt)}${featured.caption ? ` · ${featured.caption}` : ''}`
              : '현상 전 · 눌러보세요'}
          </span>
        </button>
      ) : (
        <div className={`${styles.polaroid} ${styles.polaroidEmpty}`}>
          <span className={styles.print}>
            <span className={styles.emptyHint}>
              사진을 끼워 넣으면
              <br />
              네거티브로 꽂혀요
            </span>
          </span>
          <span className={styles.caption}>Ctrl V · 끌어다 놓기</span>
        </div>
      )}

      {children}

      <div aria-hidden="true" className={styles.sheen} />
    </div>
  );
}
