import { useMemo } from 'react';
import {
  addDays,
  daysBetween,
  fadeLevel,
  formatMonthDay,
  isoWeek,
  startOfWeek,
  todayKey,
  weekDays,
  type DateKey,
} from '@fade/core';
import { Binder } from '../components/Binder/Binder';
import { BestShot } from '../features/week/BestShot';
import { ContactSheet } from '../features/week/ContactSheet';
import { DayLines } from '../features/week/DayLines';
import { WeekNoteForm } from '../features/week/WeekNoteForm';
import type { WeekDay } from '../features/week/types';
import { useEntries, useWeekNote } from '../hooks/useEntry';
import { store } from '../lib/storage';
import { navigate } from '../lib/router';
import styles from './WeekPage.module.css';

export function WeekPage({ date }: { date: DateKey }) {
  const weekStart = startOfWeek(date);
  const dates = useMemo(() => weekDays(weekStart), [weekStart]);
  const entries = useEntries(dates);
  const [note, updateNote] = useWeekNote(weekStart);
  const today = todayKey();

  const days: WeekDay[] = dates.map((d) => {
    const entry = entries[d];
    return {
      date: d,
      entry,
      fade: entry ? fadeLevel(entry, today) : 0,
      isFuture: daysBetween(today, d) > 0,
    };
  });

  // 고른 한 컷이 없으면 사진이 있는 가장 최근 날
  const bestDate =
    note.bestDate ?? [...days].reverse().find((d) => d.entry && d.entry.photos.length > 0)?.date ?? null;
  const bestDay = days.find((d) => d.date === bestDate);

  const toggleTranscribed = (d: DateKey) => {
    const entry = store.getEntry(d);
    if (!entry) return;
    store.saveEntry({ ...entry, transcribedAt: entry.transcribedAt ? null : new Date().toISOString() });
  };

  const left = (
    <>
      <ContactSheet days={days} bestDate={bestDate} onPick={(d) => updateNote({ bestDate: d })} />
      <BestShot day={bestDay} />
    </>
  );

  const right = (
    <>
      <div className={styles.kicker}>
        WEEK {isoWeek(weekStart)} · {formatMonthDay(weekStart)} — {formatMonthDay(addDays(weekStart, 6))}
      </div>
      <h1 className={styles.title}>Week {isoWeek(weekStart)}</h1>
      <p className={styles.subtitle}>{note.keywords.trim() || '이번 주를 세 단어로 적어 보세요'}</p>

      <DayLines days={days} onToggleTranscribed={toggleTranscribed} />
      <WeekNoteForm note={note} onChange={updateNote} />

      <p className={styles.footer}>옮겨 쓰기 전까지, 기록은 매일 조금씩 바래요.</p>
    </>
  );

  return (
    <Binder
      active="week"
      date={date}
      leftLabel="한 주 밀착 인화"
      rightLabel="한 주 돌아보기"
      leftVariant="contact"
      left={left}
      right={right}
      headerActions={
        <>
          <button type="button" className={styles.navButton} onClick={() => navigate({ name: 'week', date: addDays(weekStart, -7) })}>
            ← 지난주
          </button>
          <button type="button" className={styles.navButton} onClick={() => navigate({ name: 'week', date: addDays(weekStart, 7) })}>
            다음 주 →
          </button>
        </>
      }
    />
  );
}
