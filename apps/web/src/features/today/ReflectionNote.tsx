import { formatTime, type Reflection } from '@fade/core';
import styles from './ReflectionNote.module.css';

export const REFLECTION_FIRST_ID = 'fade-reflection-good';

const FIELDS: { key: keyof Reflection; label: string; placeholder: string }[] = [
  { key: 'good', label: '오늘 잘한 것', placeholder: '작아도 괜찮아요' },
  { key: 'regret', label: '아쉬운 것', placeholder: '내일 덜 아쉽게' },
  { key: 'toTomorrow', label: '내일의 나에게', placeholder: '한 줄만' },
];

interface Props {
  reflection: Reflection;
  fixedAt: string | null;
  onChange: (reflection: Reflection) => void;
  onFix: () => void;
  onUnfix: () => void;
}

export function ReflectionNote({ reflection, fixedAt, onChange, onFix, onUnfix }: Props) {
  return (
    <section aria-label="오늘의 회고" className={styles.note}>
      <h2 className={styles.heading}>a note to myself</h2>

      {FIELDS.map((f, i) => (
        <div key={f.key} className={styles.row}>
          <label htmlFor={i === 0 ? REFLECTION_FIRST_ID : `fade-reflection-${f.key}`} className={styles.label}>
            {f.label} :
          </label>
          <input
            id={i === 0 ? REFLECTION_FIRST_ID : `fade-reflection-${f.key}`}
            className={styles.input}
            value={reflection[f.key]}
            placeholder={f.placeholder}
            onChange={(e) => onChange({ ...reflection, [f.key]: e.target.value })}
          />
        </div>
      ))}

      {fixedAt && (
        <button type="button" className={styles.stamp} onClick={onUnfix} title="눌러서 정착 풀기">
          FIXED
          <span className={styles.stampSub}>{formatTime(fixedAt)} · 천천히 바래요</span>
        </button>
      )}

      <div className={styles.footer}>
        <span className={styles.hint}>정착하면 바래는 속도가 절반이 돼요 · 종이에 옮겨 쓰면 멈춰요</span>
        {!fixedAt && (
          <button type="button" className={styles.fix} onClick={onFix}>
            오늘을 정착하기 · Ctrl Enter
          </button>
        )}
      </div>
    </section>
  );
}
