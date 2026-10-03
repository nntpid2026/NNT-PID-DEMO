import React from 'react';
import { FiPlus, FiTrash2, FiGrid } from 'react-icons/fi';
import Select from '../../../components/ui/Select';
import { onEnterNext } from './formNav';

/**
 * Editable grid for one configurable component category (valve, flange, …).
 * Columns come from the Categories & Fields config, so the grid adapts to
 * whatever the company has defined.
 */
export default function ComponentGrid({ category, items, onChange }) {
  const fields = category.fields || [];

  const handleCellChange = (rowIndex, fieldId, value) => {
    const next = [...items];
    next[rowIndex] = { ...next[rowIndex], [fieldId]: value };
    onChange(next);
  };

  const handleAddRow = () => {
    const newRow = {};
    fields.forEach((f) => {
      newRow[f.id] = f.type === 'select' && f.options.length ? f.options[0] : '';
    });
    onChange([...items, newRow]);
  };

  const handleDeleteRow = (rowIndex) => {
    onChange(items.filter((_, i) => i !== rowIndex));
  };

  return (
    <div
      data-form-root
      onKeyDown={onEnterNext}
      className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
    >
      {/* Grid header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <FiGrid size={16} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-foreground text-sm truncate">{category.name}</h3>
          <p className="text-[11px] text-muted-foreground nums">
            {items.length} row{items.length === 1 ? '' : 's'} · {fields.length} column{fields.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/60">
            <tr>
              <th scope="col" className="px-4 py-3 text-[11px] uppercase tracking-wider font-bold text-muted-foreground w-12 text-center">
                #
              </th>
              {fields.map((f) => (
                <th key={f.id} scope="col" className="px-4 py-3 text-[11px] uppercase tracking-wider font-bold text-muted-foreground whitespace-nowrap">
                  {f.name}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 w-12">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => (
              <tr key={idx} className="border-b border-border hover:bg-secondary/40 transition-colors group">
                <td className="px-4 py-2 text-sm font-medium text-muted-foreground text-center nums">{idx + 1}</td>
                {fields.map((f) => (
                  <td key={f.id} className="px-3 py-2">
                    {f.type === 'select' ? (
                      <Select
                        variant="cell"
                        value={row[f.id] || ''}
                        onChange={(v) => handleCellChange(idx, f.id, v)}
                        options={f.options}
                        placeholder="—"
                        emptyValue=""
                        ariaLabel={`${f.name} for row ${idx + 1}`}
                      />
                    ) : (
                      <input
                        type={f.type === 'number' ? 'number' : 'text'}
                        value={row[f.id] || ''}
                        onChange={(e) => handleCellChange(idx, f.id, e.target.value)}
                        inputMode={f.type === 'number' ? 'decimal' : undefined}
                        min={f.type === 'number' ? 0 : undefined}
                        className="w-full h-9 px-3 text-sm font-medium bg-background border border-border hover:border-primary/50 focus:border-primary focus:bg-background rounded-md transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      />
                    )}
                  </td>
                ))}
                <td className="px-4 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(idx)}
                    aria-label={`Delete row ${idx + 1}`}
                    className="text-muted-foreground hover:text-destructive p-2 rounded-md hover:bg-destructive/10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
                  >
                    <FiTrash2 size={16} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={fields.length + 2} className="px-5 py-14 text-center text-sm text-muted-foreground italic">
                  No {category.name.toLowerCase()} added yet. Use “Add Row” below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-border bg-card">
        <button
          type="button"
          onClick={handleAddRow}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <FiPlus size={16} aria-hidden="true" />
          Add Row
        </button>
      </div>
    </div>
  );
}
