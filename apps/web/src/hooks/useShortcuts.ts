import { useEffect, useRef } from 'react';

/**
 * 'mod+arrowleft', 'mod+shift+r', 'mod+enter' 같은 키 조합 → 핸들러.
 * mod = Windows/Linux의 Ctrl, macOS의 ⌘
 */
export type ShortcutMap = Record<string, (e: KeyboardEvent) => void | false>;

function comboOf(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push('mod');
  if (e.shiftKey) parts.push('shift');
  if (e.altKey) parts.push('alt');
  parts.push(e.key.toLowerCase());
  return parts.join('+');
}

/** 글을 쓰는 중인지 (입력칸에서는 화살표 단축키를 양보한다) */
export function isTyping(e: KeyboardEvent): boolean {
  const el = e.target as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
}

export function useShortcuts(map: ShortcutMap) {
  const ref = useRef(map);
  ref.current = map;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const handler = ref.current[comboOf(e)];
      if (handler) {
        // 핸들러가 false를 돌려주면 기본 동작을 막지 않는다
        if (handler(e) !== false) e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
