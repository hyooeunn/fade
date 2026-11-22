import { daysBetween, fromDateKey, formatMonthDay, weekdayShortEn, type DateKey } from '@fade/core';
import styles from './DateTicket.module.css';

/** 1월 1일부터 센 번호 = 올해의 몇 번째 프레임 */
function frameNumber(date: DateKey): string {
  const year = fromDateKey(date).getFullYear();
  const n = daysBetween(`${year}-01-01`, date) + 1;
  return String(n).padStart(4, '0');
}

export function DateTicket({ date }: { date: DateKey }) {
  const weekday = weekdayShortEn(date);
  return (
    <>
      <div className={styles.ticket}>
        <div className={styles.kicker}>FRAME · NO.{frameNumber(date)}</div>
        <div className={styles.date}>
          {formatMonthDay(date)} {weekday.charAt(0) + weekday.slice(1).toLowerCase()}
        </div>
      </div>
      <div aria-hidden="true" className={styles.wire} />
      <span aria-hidden="true" className={styles.bead} />
    </>
  );
}
