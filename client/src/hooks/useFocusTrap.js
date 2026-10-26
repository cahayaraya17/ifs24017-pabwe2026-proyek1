import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Menjaga fokus keyboard tetap di dalam dialog: fokus awal ke elemen `[data-autofocus]`
 * (atau elemen fokus pertama), Tab/Shift+Tab berputar di dalam dialog, Escape memanggil
 * `onEscape`, dan fokus dikembalikan ke pemicu saat dialog ditutup.
 */
export function useFocusTrap(onEscape) {
  const containerRef = useRef(null);
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    const container = containerRef.current;
    const previouslyFocused = document.activeElement;
    const getFocusable = () => [...container.querySelectorAll(FOCUSABLE_SELECTOR)];

    (container.querySelector('[data-autofocus]') ?? getFocusable()[0]).focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onEscapeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = getFocusable();
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    container.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.focus();
    };
  }, []);

  return containerRef;
}
