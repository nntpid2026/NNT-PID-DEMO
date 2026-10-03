import React from 'react';
import {
  FiCopy, FiTrash2, FiMenu, FiCheck, FiRefreshCw,
  FiChevronLeft, FiChevronRight, FiAlertCircle, FiZap,
} from 'react-icons/fi';

function SaveStatus({ state }) {
  const saving = state === 'saving';
  return (
    <span
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-foreground/15 text-primary-foreground"
    >
      {saving
        ? <FiRefreshCw size={12} className="animate-spin" aria-hidden="true" />
        : <FiCheck size={12} aria-hidden="true" />}
      {saving ? 'Saving…' : 'Saved'}
    </span>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-foreground/15 text-primary-foreground text-xs font-medium whitespace-nowrap">
      {children}
    </span>
  );
}

function IconButton({ onClick, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="w-9 h-9 rounded-lg bg-primary-foreground/10 text-primary-foreground flex items-center justify-center transition-colors hover:bg-primary-foreground/25 disabled:opacity-35 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/60"
    >
      {children}
    </button>
  );
}

/** Compact gradient hero: identity, actions and a full-width completeness strip. */
export default function LineHeader({
  line,
  lineIndex,
  totalLines,
  saveState,
  progress,
  issues,
  onPrev,
  onNext,
  onDuplicate,
  onDelete,
  onOpenList,
}) {
  const atStart = lineIndex <= 0;
  const atEnd = lineIndex >= totalLines - 1;

  return (
    <div className="relative shrink-0 overflow-hidden rounded-2xl bg-primary bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg ring-1 ring-primary-foreground/15 dark:shadow-[0_20px_50px_-15px_rgba(47,163,158,0.5)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-8 w-60 h-60 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 w-52 h-52 rounded-full bg-black/10 dark:bg-black/30 blur-2xl" />
      </div>

      <div className="relative p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Identity */}
          <div className="flex items-start gap-3 min-w-0">
            <button
              type="button"
              onClick={onOpenList}
              aria-label="Show line list"
              className="lg:hidden shrink-0 w-9 h-9 rounded-lg bg-primary-foreground/10 text-primary-foreground flex items-center justify-center hover:bg-primary-foreground/25 transition-colors"
            >
              <FiMenu size={18} aria-hidden="true" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] bg-primary-foreground/20 px-2 py-1 rounded-md">
                  <FiZap size={10} aria-hidden="true" /> Active line
                </span>
                <span className="text-[11px] font-medium opacity-75 nums">
                  {lineIndex + 1} / {totalLines}
                </span>
              </div>

              <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight nums truncate">
                {line.no || 'Untitled line'}
              </h1>

              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                <Chip>{line.size || 'Size —'}</Chip>
                <Chip>{line.duty || 'Duty —'}</Chip>
                <Chip>
                  {line.from || '?'}
                  <span className="opacity-60" aria-hidden="true">→</span>
                  {line.to || '?'}
                </Chip>
                <Chip>{line.length || 0} m</Chip>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap lg:shrink-0 lg:justify-end">
            <span className="hidden sm:inline-flex"><SaveStatus state={saveState} /></span>

            <div className="flex items-center gap-1">
              <IconButton onClick={onPrev} disabled={atStart} label="Previous line">
                <FiChevronLeft size={16} aria-hidden="true" />
              </IconButton>
              <IconButton onClick={onNext} disabled={atEnd} label="Next line">
                <FiChevronRight size={16} aria-hidden="true" />
              </IconButton>
            </div>

            <button
              type="button"
              onClick={onDuplicate}
              className="h-9 px-3 inline-flex items-center gap-2 rounded-lg bg-primary-foreground/10 text-primary-foreground text-sm font-semibold hover:bg-primary-foreground/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/60"
            >
              <FiCopy size={15} aria-hidden="true" />
              <span className="hidden sm:inline">Duplicate</span>
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="h-9 px-3 inline-flex items-center gap-2 rounded-lg bg-primary-foreground/10 text-primary-foreground text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/60"
            >
              <FiTrash2 size={15} aria-hidden="true" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Completeness strip */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-[11px] font-semibold opacity-80 whitespace-nowrap">
            Completeness <span className="nums">{progress}%</span>
          </span>
          <div className="h-1.5 flex-1 rounded-full bg-primary-foreground/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-foreground origin-left-grow transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {issues.length > 0 ? (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] opacity-80 whitespace-nowrap">
              <FiAlertCircle size={11} aria-hidden="true" /> Missing: {issues.join(', ')}
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] opacity-80 whitespace-nowrap">
              <FiCheck size={11} aria-hidden="true" /> All good
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
