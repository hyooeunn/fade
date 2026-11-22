import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { countChars, formatTime, type Entry } from '@fade/core';
import styles from './DiaryEditor.module.css';

const SAVE_DELAY = 400;

interface Props {
  entry: Entry;
  onSave: (patch: Pick<Entry, 'title' | 'body'>) => void;
}

/**
 * 제목 + 줄 노트 본문. 타이핑할 때마다 저장하지 않고 잠깐 멈추면 저장한다.
 * 부모에서 key={date}로 날짜가 바뀌면 새로 마운트한다.
 */
export function DiaryEditor({ entry, onSave }: Props) {
  const [title, setTitle] = useState(entry.title);
  const [body, setBody] = useState(entry.body);
  const [dirty, setDirty] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const latest = useRef({ title, body });
  latest.current = { title, body };

  // 멈추면 저장
  useEffect(() => {
    if (!dirty) return;
    const t = window.setTimeout(() => {
      onSave(latest.current);
      setDirty(false);
    }, SAVE_DELAY);
    return () => window.clearTimeout(t);
  }, [title, body, dirty, onSave]);

  // 화면을 떠날 때 남은 내용 저장
  useEffect(() => {
    return () => {
      if (latest.current.title !== entry.title || latest.current.body !== entry.body) {
        onSave(latest.current);
      }
    };
    // 마운트 시점의 entry 기준으로 비교
  }, []);

  // 본문 높이 자동 조절
  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(306, el.scrollHeight)}px`;
  }, [body]);

  return (
    <div className={styles.editor}>
      <label className="sr-only" htmlFor="fade-title">
        제목
      </label>
      <input
        id="fade-title"
        className={styles.title}
        value={title}
        placeholder="오늘의 제목"
        onChange={(e) => {
          setTitle(e.target.value);
          setDirty(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            bodyRef.current?.focus();
          }
        }}
      />
      <label className="sr-only" htmlFor="fade-body">
        오늘의 일기
      </label>
      <textarea
        id="fade-body"
        ref={bodyRef}
        className={styles.body}
        value={body}
        placeholder="흐려지기 전에, 오늘을 적어두세요."
        onChange={(e) => {
          setBody(e.target.value);
          setDirty(true);
        }}
      />
      <div className={styles.status} aria-live="polite">
        {countChars(body)}자 ·{' '}
        {dirty ? '쓰는 중…' : !title && !body ? '아직 빈 페이지' : `저장됨 ${formatTime(entry.updatedAt)}`}
      </div>
    </div>
  );
}
