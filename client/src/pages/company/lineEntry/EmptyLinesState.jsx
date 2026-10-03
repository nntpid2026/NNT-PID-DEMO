import React from 'react';
import { FiList, FiPlus } from 'react-icons/fi';

/** Friendly empty state for a project with no lines yet. */
export default function EmptyLinesState({ onNew }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center surface rounded-2xl border border-dashed border-border bg-card p-10">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <FiList size={26} aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-foreground">No lines in this project yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first line, then add valves, flanges, instruments and insulation — the BOQ
          builds itself as you type.
        </p>
        <button
          type="button"
          onClick={onNew}
          className="mt-6 h-11 px-6 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <FiPlus size={16} aria-hidden="true" />
          Create First Line
        </button>
      </div>
    </div>
  );
}
