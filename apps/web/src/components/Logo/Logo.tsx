import styles from './Logo.module.css';

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <span className={styles.logo}>
      <span className={styles.word} style={{ fontSize: size }}>
        Fade
      </span>
      <span className={styles.vol}>{new Date().getFullYear()} · VOL.01</span>
    </span>
  );
}
