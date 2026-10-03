// ─────────────────────────────────────────────────────────────────────────────
// Keyboard helpers for fast, keyboard-first data entry.
// Any container marked with [data-form-root] gets Enter-to-next-field behaviour.
// ─────────────────────────────────────────────────────────────────────────────

const FOCUSABLE = 'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])';

export function getFormFields(root) {
  if (!root) return [];
  return Array.from(root.querySelectorAll(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  );
}

/**
 * Enter → move focus to the next field inside the same [data-form-root].
 * Selects keep their native Enter behaviour (choosing an option).
 */
export function onEnterNext(e) {
  if (e.key !== 'Enter') return;
  const el = e.target;
  if (!(el instanceof HTMLElement)) return;

  const tag = el.tagName;
  const isField = tag === 'INPUT' || tag === 'TEXTAREA';
  if (!isField) return;
  if (el.getAttribute('type') === 'textarea') return;

  const root = el.closest('[data-form-root]');
  if (!root) return;

  const fields = getFormFields(root);
  const index = fields.indexOf(el);
  if (index === -1) return;

  e.preventDefault();
  const next = fields[index + 1];
  if (next) {
    next.focus();
    if (typeof next.select === 'function' && next.tagName === 'INPUT') next.select();
  } else {
    el.blur();
  }
}

/** Arrow up/down inside a search box to walk the visible list. */
export function onListArrowNav(e, items, activeId, onSelect) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  if (!items.length) return;
  e.preventDefault();
  const current = items.findIndex((item) => item.id === activeId);
  const step = e.key === 'ArrowDown' ? 1 : -1;
  const next = current === -1 ? 0 : Math.min(items.length - 1, Math.max(0, current + step));
  const target = items[next];
  if (target) onSelect(target.id);
}
