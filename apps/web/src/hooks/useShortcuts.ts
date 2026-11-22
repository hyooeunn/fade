import { useEffect, useRef } from 'react';

/**
 * 'mod+arrowleft', 'mod+shift+r', 'mod+enter' 같은 키 조합 → 핸들러.
 * mod = Windows/Linux의 Ctrl, macOS의 ⌘
 */
export type ShortcutMap = Record<string, (e: KeyboardEvent) => void>;

function comboOf(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push('mod');
  if (e.shiftKey) parts.push('shift');
  if (e.altKey) parts.push('alt');
  parts.push(e.key.toLowerCase());
  return parts.join('+');
}

export function useShortcuts(map: ShortcutMap) {
  const ref = useRef(map);
  ref.current = map;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const handler = ref.current[comboOf(e)];
      if (handler) {
        e.preventDefault();
        handler(e);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
