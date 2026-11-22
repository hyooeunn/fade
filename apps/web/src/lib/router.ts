import { useSyncExternalStore } from 'react';
import { todayKey, type DateKey } from '@fade/core';

export type Route =
  | { name: 'cover' }
  | { name: 'day'; date: DateKey }
  | { name: 'week'; date: DateKey };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseHash(hash: string): Route {
  const [, section, date] = hash.replace(/^#/, '').split('/');
  const safeDate = date && DATE_RE.test(date) ? date : todayKey();
  if (section === 'day') return { name: 'day', date: safeDate };
  if (section === 'week') return { name: 'week', date: safeDate };
  return { name: 'cover' };
}

export function hrefFor(route: Route): string {
  switch (route.name) {
    case 'cover':
      return '#/';
    case 'day':
      return `#/day/${route.date}`;
    case 'week':
      return `#/week/${route.date}`;
  }
}

export function navigate(route: Route) {
  window.location.hash = hrefFor(route);
}

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  return parseHash(hash);
}
