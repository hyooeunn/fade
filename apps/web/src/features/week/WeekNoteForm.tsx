import type { WeekNote } from '@fade/core';
import styles from './WeekNoteForm.module.css';

type Field = 'keywords' | 'bestMoment' | 'toNextWeek';

const FIELDS: { key: Field; label: string; placeholder: string }[] = [
  { key: 'keywords', label: '키워드', placeholder: '세 단어로' },
  { key: 'bestMoment', label: '베스트 모먼트', placeholder: '이번 주 가장 좋았던 순간' },
  { key: 'toNextWeek', label: '다음 주의 나에게', placeholder: '한 줄만' },
];

interface Props {
  note: WeekNote;
  onChange: (patch: Partial<WeekNote>) => void;
}

export function WeekNoteForm({ note, onChange }: Props) {
  return (
    <section aria-label="이번 주 회고" className={styles.note}>
      <h2 className={styles.heading}>a note for this week</h2>
      {FIELDS.map((f) => (
        <div key={f.key} className={styles.row}>
          <label htmlFor={`fade-week-${f.key}`} className={styles.label}>
            {f.label} :
          </label>
          <input
            id={`fade-week-${f.key}`}
            className={styles.input}
            value={note[f.key]}
            placeholder={f.placeholder}
            onChange={(e) => onChange({ [f.key]: e.target.value })}
          />
        </div>
      ))}
    </section>
  );
}
