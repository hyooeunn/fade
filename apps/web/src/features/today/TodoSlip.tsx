import { useState, type FormEvent } from 'react';
import { newId, type Todo } from '@fade/core';
import styles from './TodoSlip.module.css';

interface Props {
  todos: Todo[];
  onChange: (todos: Todo[]) => void;
}

export function TodoSlip({ todos, onChange }: Props) {
  const [draft, setDraft] = useState('');

  const add = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onChange([...todos, { id: newId(), text, done: false }]);
    setDraft('');
  };

  const toggle = (id: string) =>
    onChange(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id: string) => onChange(todos.filter((t) => t.id !== id));

  return (
    <div className={styles.slip}>
      <svg aria-hidden="true" className={styles.clip} width="20" height="54" viewBox="0 0 22 58">
        <path d="M7 50 V12 a6 6 0 0 1 12 0 V46 a8.5 8.5 0 0 1 -17 0 V16" fill="none" stroke="#9A9C9F" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <h2 className={styles.title}>to do</h2>

      <ul className={styles.list}>
        {todos.map((t) => (
          <li key={t.id} className={styles.item}>
            <button
              type="button"
              role="checkbox"
              aria-checked={t.done}
              aria-label={t.text}
              onClick={() => toggle(t.id)}
              className={`${styles.box} ${t.done ? styles.boxDone : ''}`}
            >
              {t.done && (
                <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F7F6F2" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              )}
            </button>
            <span className={`${styles.text} ${t.done ? styles.textDone : ''}`}>{t.text}</span>
            <button type="button" aria-label={`${t.text} 지우기`} onClick={() => remove(t.id)} className={styles.remove}>
              ×
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={add}>
        <label className={styles.add}>
          <span className="sr-only">할 일 추가</span>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="+ 한 줄 더 · Enter"
            className={styles.input}
          />
        </label>
      </form>
    </div>
  );
}
