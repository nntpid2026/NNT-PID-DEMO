import React, {
  useCallback, useEffect, useId, useMemo, useRef, useState,
} from 'react';
import { createPortal } from 'react-dom';
import { FiChevronDown, FiCheck, FiSearch } from 'react-icons/fi';
import { cn } from '../../utils/utils';

const toItems = (options) =>
  (options || []).map((o) => (typeof o === 'string' ? { value: o, label: o } : o));

const TRIGGER_VARIANTS = {
  field:
    'w-full h-10 pl-3 pr-9 rounded-lg border bg-background text-sm transition-all shadow-sm focus:outline-none focus:ring-2',
  cell:
    'w-full h-9 px-3 rounded-md text-sm font-medium bg-background border border-border shadow-sm transition-all focus:outline-none focus-visible:ring-2',
};

/**
 * Custom dropdown — replaces native <select> so the design stays consistent
 * across OS/browsers.
 *  - Rendered in a portal (never clipped by scrollable cards/tables).
 *  - Auto search box for long lists, ↑/↓ + Enter + Esc + type-ahead.
 *  - Full ARIA combobox/listbox semantics.
 */
export default function Select({
  id,
  value,
  onChange,
  options,
  placeholder = '—',
  emptyValue,
  allowEmpty = true,
  disabled = false,
  error = false,
  onBlur,
  ariaLabel,
  describedBy,
  variant = 'field',
  className,
  panelClassName,
  searchable,
}) {
  const reactId = useId();
  const listId = `${id || reactId}-listbox`;
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const searchRef = useRef(null);
  const typeahead = useRef({ buffer: '', at: 0 });

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const [rect, setRect] = useState(null);

  const items = useMemo(() => toItems(options), [options]);
  const empty = emptyValue !== undefined ? emptyValue : placeholder;
  const showSearch = searchable !== undefined ? searchable : items.length > 6;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => String(i.label).toLowerCase().includes(q));
  }, [items, query]);

  const rows = useMemo(() => {
    const list = filtered.map((i) => ({ ...i, kind: 'option' }));
    if (allowEmpty && !query.trim()) {
      return [{ kind: 'empty', value: empty, label: placeholder }, ...list];
    }
    return list;
  }, [filtered, allowEmpty, query, empty, placeholder]);

  const selected = items.find((i) => i.value === value);
  const isBlank = value === '' || value === null || value === undefined || value === empty;
  const label = selected ? selected.label : placeholder;

  const close = useCallback((fireBlur = true) => {
    setOpen(false);
    setQuery('');
    if (fireBlur) onBlur?.();
  }, [onBlur]);

  const openMenu = useCallback(() => {
    if (disabled) return;
    const node = triggerRef.current;
    if (!node) return;
    setRect(node.getBoundingClientRect());
    const idx = rows.findIndex((r) => r.value === value);
    setHighlight(idx >= 0 ? idx : 0);
    setOpen(true);
  }, [disabled, rows, value]);

  const commit = useCallback((row) => {
    if (!row) return;
    onChange?.(row.value);
    setOpen(false);
    setQuery('');
    onBlur?.();
    triggerRef.current?.focus();
  }, [onChange, onBlur]);

  // Reposition on scroll/resize while open
  useEffect(() => {
    if (!open) return undefined;
    const sync = () => {
      if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    };
    window.addEventListener('scroll', sync, true);
    window.addEventListener('resize', sync);
    return () => {
      window.removeEventListener('scroll', sync, true);
      window.removeEventListener('resize', sync);
    };
  }, [open]);

  // Click outside
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (triggerRef.current?.contains(e.target)) return;
      if (panelRef.current?.contains(e.target)) return;
      close();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, close]);

  // Focus the search box when the menu opens
  useEffect(() => {
    if (open && showSearch) searchRef.current?.focus();
  }, [open, showSearch]);

  // Keep the highlighted row visible
  useEffect(() => {
    if (!open) return;
    const el = panelRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [open, highlight]);

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        openMenu();
        return;
      }
      // type-ahead while closed
      if (e.key.length === 1 && /\S/.test(e.key)) {
        const now = Date.now();
        typeahead.current.buffer =
          now - typeahead.current.at > 700 ? e.key : typeahead.current.buffer + e.key;
        typeahead.current.at = now;
        const buf = typeahead.current.buffer.toLowerCase();
        const hit = items.find((i) => String(i.label).toLowerCase().startsWith(buf));
        if (hit) {
          e.preventDefault();
          onChange?.(hit.value);
        }
      }
      return;
    }

    if (e.key === 'Escape') { e.preventDefault(); close(false); triggerRef.current?.focus(); return; }
    if (e.key === 'Tab') { close(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(rows.length - 1, h + 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
      return;
    }
    if (e.key === 'Home') { e.preventDefault(); setHighlight(0); return; }
    if (e.key === 'End') { e.preventDefault(); setHighlight(rows.length - 1); return; }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      commit(rows[highlight]);
    }
  };

  const isCell = variant === 'cell';
  const openUp = rect ? window.innerHeight - rect.bottom < 300 && rect.top > 300 : false;
  const panelWidth = Math.max(rect ? rect.width : 0, 220);

  return (
    <>
      <button
        type="button"
        id={id}
        ref={triggerRef}
        disabled={disabled}
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        aria-activedescendant={
          open && !showSearch ? `${listId}-opt-${highlight}` : undefined
        }
        className={cn(
          TRIGGER_VARIANTS[variant],
          'inline-flex items-center justify-between gap-2 text-left cursor-pointer',
          isCell
            ? cn(
                'hover:border-primary/50 focus:border-primary focus-visible:ring-primary/40',
                open && 'border-primary ring-2 ring-primary/30'
              )
            : cn(
                error
                  ? 'border-destructive focus:ring-destructive/40'
                  : 'border-border hover:border-primary/50 focus:ring-primary/50',
                open && 'border-primary ring-2 ring-primary/30'
              ),
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <span className={cn('truncate', isBlank && 'text-muted-foreground')}>{label}</span>
        <FiChevronDown
          size={14}
          aria-hidden="true"
          className={cn(
            'shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && rect && createPortal(
        <div
          ref={panelRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className={cn(
            'fixed z-[95] rounded-xl border border-border bg-card shadow-xl overflow-hidden animate-pop-in',
            panelClassName
          )}
          style={{
            left: Math.max(8, Math.min(rect.left, window.innerWidth - panelWidth - 8)),
            width: panelWidth,
            ...(openUp
              ? { bottom: window.innerHeight - rect.top + 6 }
              : { top: rect.bottom + 6 }),
          }}
        >
          {showSearch && (
            <div className="p-2 border-b border-border">
              <div className="relative">
                <FiSearch
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={13}
                  aria-hidden="true"
                />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setHighlight(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search…"
                  aria-label="Search options"
                  aria-controls={listId}
                  aria-activedescendant={`${listId}-opt-${highlight}`}
                  className="w-full h-8 pl-8 pr-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          )}

          <div className="max-h-[264px] overflow-y-auto scrollbar-thin p-1.5">
            {rows.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground italic">
                No matches
              </div>
            ) : (
              rows.map((row, i) => {
                const isSelected = row.kind === 'empty' ? isBlank : row.value === value;
                const isActive = i === highlight;
                return (
                  <div
                    key={`${row.value}-${i}`}
                    id={`${listId}-opt-${i}`}
                    role="option"
                    aria-selected={isSelected}
                    data-active={isActive}
                    onMouseEnter={() => setHighlight(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => commit(row)}
                    className={cn(
                      'flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors',
                      isActive && 'bg-secondary',
                      isSelected && 'text-primary font-semibold',
                      !isSelected && !isActive && 'text-foreground'
                    )}
                  >
                    <span className={cn('truncate', row.kind === 'empty' && 'text-muted-foreground')}>
                      {row.label}
                    </span>
                    {isSelected && <FiCheck size={14} className="shrink-0" aria-hidden="true" />}
                  </div>
                );
              })
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
