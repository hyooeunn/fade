import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react';
import {
  addDays,
  formatLongEn,
  isoWeek,
  newId,
  weekdayEn,
  type DateKey,
  type Entry,
  type Photo,
} from '@fade/core';
import { Binder } from '../components/Binder/Binder';
import { DateTicket } from '../features/today/DateTicket';
import { DiaryEditor } from '../features/today/DiaryEditor';
import { ExposureCard } from '../features/today/ExposureCard';
import { REFLECTION_FIRST_ID, ReflectionNote } from '../features/today/ReflectionNote';
import { Sleeve } from '../features/today/Sleeve';
import { TodoSlip } from '../features/today/TodoSlip';
import { useEntry } from '../hooks/useEntry';
import { isTyping, useShortcuts } from '../hooks/useShortcuts';
import { fileToCompressedDataUrl, imageFilesFrom } from '../lib/image';
import { navigate } from '../lib/router';
import styles from './TodayPage.module.css';

export function TodayPage({ date }: { date: DateKey }) {
  const [entry, update] = useEntry(date);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const save = useCallback(
    (patch: Partial<Entry> | ((prev: Entry) => Entry)) => {
      try {
        update(patch);
      } catch (e) {
        setError(e instanceof Error ? e.message : '저장하지 못했어요.');
      }
    },
    [update],
  );

  const saveText = useCallback((patch: Pick<Entry, 'title' | 'body'>) => save(patch), [save]);

  const addFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      try {
        const photos: Photo[] = await Promise.all(
          files.map(async (file) => ({
            id: newId(),
            src: await fileToCompressedDataUrl(file),
            caption: '',
            developed: false,
            createdAt: new Date().toISOString(),
          })),
        );
        save((prev) => ({ ...prev, photos: [...prev.photos, ...photos] }));
      } catch {
        setError('사진을 불러오지 못했어요.');
      }
    },
    [save],
  );

  // Ctrl+V로 사진 붙이기 (글을 쓰다가도 이미지면 사진으로)
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = imageFilesFrom(e.clipboardData?.items);
      if (files.length) {
        e.preventDefault();
        void addFiles(files);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [addFiles]);

  useEffect(() => {
    if (!error) return;
    const t = window.setTimeout(() => setError(null), 4000);
    return () => window.clearTimeout(t);
  }, [error]);

  const goTo = (offset: number) => navigate({ name: 'day', date: addDays(date, offset) });
  const fix = () => save({ fixedAt: new Date().toISOString() });

  useShortcuts({
    'mod+arrowleft': (e) => (isTyping(e) ? false : goTo(-1)),
    'mod+arrowright': (e) => (isTyping(e) ? false : goTo(1)),
    'mod+shift+e': () => document.getElementById(REFLECTION_FIRST_ID)?.focus(),
    'mod+enter': () => fix(),
  });

  const toggleDevelop = (id: string) =>
    save((prev) => ({
      ...prev,
      photos: prev.photos.map((p) => (p.id === id ? { ...p, developed: !p.developed } : p)),
    }));

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void addFiles(imageFilesFrom(e.dataTransfer.files));
  };

  const cover = entry.photos.find((p) => p.developed);

  const left = (
    <div
      className={`${styles.leftInner} ${dragging ? styles.dragging : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <DateTicket date={date} />

      <Sleeve photos={entry.photos} onToggleDevelop={toggleDevelop}>
        <ExposureCard value={entry.exposure} onChange={(exposure) => save({ exposure })} />
      </Sleeve>

      <TodoSlip todos={entry.todos} onChange={(todos) => save({ todos })} />

      <p className={styles.develop}>
        필름은 네거티브로 꽂혀요.
        <br />
        눌러서 현상하세요.
      </p>

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          void addFiles(imageFilesFrom(e.target.files));
          e.target.value = '';
        }}
      />
      <button type="button" className={styles.addPhoto} onClick={() => fileInput.current?.click()}>
        + 필름 끼워 넣기 · Ctrl V
      </button>
    </div>
  );

  const right = (
    <>
      <div className={styles.pageHead}>
        <div>
          <div className={styles.kicker}>
            {weekdayEn(date)} · WEEK {isoWeek(date)}
          </div>
          <h1 className={styles.dateTitle}>{formatLongEn(date)}</h1>
        </div>
        <figure className={styles.mini}>
          {cover ? <img src={cover.src} alt="" /> : <span aria-hidden="true" className={styles.miniEmpty} />}
          <figcaption>오늘의 한 장</figcaption>
        </figure>
      </div>

      <DiaryEditor key={date} entry={entry} onSave={saveText} />

      <ReflectionNote
        reflection={entry.reflection}
        fixedAt={entry.fixedAt}
        onChange={(reflection) => save({ reflection })}
        onFix={fix}
        onUnfix={() => save({ fixedAt: null })}
      />

      <div className={styles.footer}>Ctrl ← → 장 넘기기 · Ctrl ⇧ E 회고로</div>
    </>
  );

  return (
    <>
      <Binder
        active="today"
        date={date}
        leftLabel="오늘의 사진과 할 일"
        rightLabel="오늘의 일기"
        left={left}
        right={right}
        showClip
        headerActions={
          <>
            <button type="button" className={styles.navButton} onClick={() => goTo(-1)}>
              ← 어제
            </button>
            <button type="button" className={styles.navButton} onClick={() => goTo(1)}>
              내일 →
            </button>
          </>
        }
      />
      {error && (
        <div role="alert" className={styles.toast}>
          {error}
        </div>
      )}
    </>
  );
}
