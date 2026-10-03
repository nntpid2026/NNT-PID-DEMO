import React, { useMemo, useState } from 'react';
import { FiSearch, FiPlus, FiCopy, FiTrash2, FiCheck, FiAlertCircle, FiX } from 'react-icons/fi';
import { cn } from '../../../utils/utils';
import { isLineComplete } from './validation';
import { onListArrowNav } from './formNav';

/**
 * Persistent master list of lines for the active project.
 * Search, completeness indicator, hover actions and ↑/↓ keyboard navigation.
 */
export default function LineListPanel({
  lines,
  activeLineId,
  onSelect,
  onNew,
  onDuplicate,
  onDelete,
  searchInputRef,
  className,
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return lines;
    return lines.filter((l) =>
      [l.no, l.from, l.to, l.duty, l.size, l.moc]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [lines, search]);

  const incomplete = useMemo(() => lines.filter((l) => !isLineComplete(l)).length, [lines]);
  const completeCount = lines.length - incomplete;
  const completePct = lines.length ? Math.round((completeCount / lines.length) * 100) : 0;

  return (
    <div className={cn('flex flex-col h-full min-h-0', className)}>
      <div className="p-4 space-y-3 border-b border-border shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-foreground">Lines</h2>
            <p className="text-[11px] text-muted-foreground nums">
              {completeCount} complete{incomplete > 0 ? ` · ${incomplete} to finish` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onNew}
            className="h-8 px-3 shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FiPlus size={14} aria-hidden="true" />
            New
          </button>
        </div>

        <div className="h-1.5 rounded-full bg-secondary overflow-hidden" title={`${completePct}% complete`}>
          <div
            className="h-full rounded-full bg-primary origin-left-grow transition-all duration-500"
            style={{ width: `${completePct}%` }}
          />
        </div>

        <div className="relative">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={14}
            aria-hidden="true"
          />
          <input
            ref={searchInputRef}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => onListArrowNav(e, filtered, activeLineId, onSelect)}
            placeholder="Search no, from, to, size…"
            aria-label="Search lines"
            className="w-full h-9 pl-9 pr-8 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <FiX size={13} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <ul className="flex-1 min-h-0 overflow-y-auto scrollbar-thin" aria-label="Line list">
        {filtered.map((l) => {
          const complete = isLineComplete(l);
          const active = l.id === activeLineId;
          return (
            <li key={l.id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => onSelect(l.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(l.id);
                  }
                }}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'group relative w-full text-left pl-5 pr-4 py-3 border-b border-border/60 cursor-pointer transition-colors',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                  active ? 'bg-primary/10' : 'hover:bg-secondary/60'
                )}
              >
                {active && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" aria-hidden="true" />
                )}
                <div className="flex items-center gap-2 pr-14">
                  <span
                    className={cn('w-2 h-2 rounded-full shrink-0', complete ? 'bg-emerald-500' : 'bg-amber-500')}
                    title={complete ? 'Complete' : 'Missing details'}
                    aria-hidden="true"
                  />
                  <span className="font-mono font-semibold text-sm text-foreground truncate">
                    {l.no || 'Untitled'}
                  </span>
                  {active && <FiCheck size={13} className="text-primary shrink-0" aria-hidden="true" />}
                </div>

                <div className="mt-1 pl-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="truncate">{l.from || '?'} → {l.to || '?'}</span>
                  <span className="shrink-0 px-1.5 py-0.5 rounded bg-secondary text-[10px] font-semibold text-foreground/80">
                    {l.size || '—'}
                  </span>
                  {l.duty && l.duty !== '—' && (
                    <span className="shrink-0 text-[10px] font-medium text-muted-foreground">{l.duty}</span>
                  )}
                </div>

                {!complete && (
                  <FiAlertCircle
                    size={12}
                    className="absolute right-4 top-3 text-amber-500 transition-opacity group-hover:opacity-0"
                    aria-hidden="true"
                  />
                )}

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDuplicate(l.id); }}
                    title="Duplicate line"
                    aria-label={`Duplicate line ${l.no || ''}`}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <FiCopy size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDelete(l.id); }}
                    title="Delete line"
                    aria-label={`Delete line ${l.no || ''}`}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <FiTrash2 size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}

        {filtered.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-muted-foreground italic">
            {lines.length === 0 ? 'No lines yet. Create your first line.' : 'No lines match your search.'}
          </li>
        )}
      </ul>

      <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground shrink-0">
        <span className="nums">{lines.length}</span> line{lines.length === 1 ? '' : 's'} ·{' '}
        <span className="nums">{incomplete}</span> incomplete
      </div>
    </div>
  );
}
