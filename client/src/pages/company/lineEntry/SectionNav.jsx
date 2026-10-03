import React from 'react';
import { cn } from '../../../utils/utils';

/**
 * Segmented control for switching the visible section of the active line.
 * Horizontally scrollable so long category lists (Valve, Reducer, …) stay usable.
 */
export default function SectionNav({ sections, active, onSelect }) {
  return (
    <nav aria-label="Line sections" className="shrink-0">
      <div className="flex gap-1.5 overflow-x-auto scrollbar-thin p-1.5 rounded-xl border border-border bg-card shadow-sm">
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {s.icon}
              <span className="whitespace-nowrap">{s.label}</span>
              {s.count > 0 && (
                <span
                  className={cn(
                    'text-[10px] nums px-1.5 py-0.5 rounded-full font-bold',
                    isActive ? 'bg-primary-foreground/25 text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {s.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

