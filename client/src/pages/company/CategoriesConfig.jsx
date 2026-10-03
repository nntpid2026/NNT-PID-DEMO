import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiLock, FiCheck, FiX } from 'react-icons/fi';
import { cn } from '../../utils/utils';
import { useMockStore } from '../../context/useMockStore';
import Select from '../../components/ui/Select';

// ── Mock projects removed — seamless project integration ───────────────────

const TYPE_COLORS = {
  text:   'bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50',
  number: 'bg-purple-500/10 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50',
  select: 'bg-orange-500/10 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50',
  auto:   'bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50',
};
const TYPE_LABEL = { text: 'Text', number: 'Number', select: 'Dropdown', auto: 'Auto' };

// ── Small inline text editor ──────────────────────────────────────────────
function InlineEdit({ value, onSave, className }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => { if (draft.trim()) onSave(draft.trim()); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  if (!editing) return (
    <button
      onClick={() => { setDraft(value); setEditing(true); }}
      className={cn("text-left group/edit flex items-center gap-1.5 hover:text-foreground transition-colors", className)}
    >
      {value}
      <FiEdit2 size={11} className="opacity-0 group-hover/edit:opacity-60 transition-opacity shrink-0" />
    </button>
  );

  return (
    <span className="flex items-center gap-1">
      <input
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
        className="border border-[#17707B] rounded px-2 h-6 text-sm focus:outline-none bg-background"
        style={{ width: Math.max(80, draft.length * 8) }}
      />
      <button onClick={save}   className="p-0.5 text-[#17707B] hover:opacity-70"><FiCheck size={13}/></button>
      <button onClick={cancel} className="p-0.5 text-muted-foreground hover:opacity-70"><FiX size={13}/></button>
    </span>
  );
}

// ── Field row ─────────────────────────────────────────────────────────────
function FieldRow({ field, isSystem, onUpdate, onDelete }) {
  const [optInput, setOptInput] = useState('');

  const addOpt = () => {
    if (!optInput.trim() || field.options.includes(optInput.trim())) return;
    onUpdate({ ...field, options: [...field.options, optInput.trim()] });
    setOptInput('');
  };
  const removeOpt = (o) => onUpdate({ ...field, options: field.options.filter(x => x !== o) });

  return (
    <div className="py-3 px-4 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        {/* Field name */}
        <div className="flex-1 min-w-0">
          {isSystem || field.type === 'auto' ? (
            <span className="text-sm font-medium text-foreground">{field.name}</span>
          ) : (
            <InlineEdit
              value={field.name}
              onSave={name => onUpdate({ ...field, name })}
              className="text-sm font-medium text-foreground"
            />
          )}
        </div>

        {/* Type badge */}
        <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0", TYPE_COLORS[field.type])}>
          {TYPE_LABEL[field.type]}
        </span>

        {/* Type switcher (non-system fields only) */}
        {!isSystem && field.type !== 'auto' && (
          <Select
            value={field.type}
            onChange={(v) => onUpdate({ ...field, type: v, options: v !== 'select' ? [] : field.options })}
            options={[
              { value: 'text', label: 'Text' },
              { value: 'number', label: 'Number' },
              { value: 'select', label: 'Dropdown' },
            ]}
            allowEmpty={false}
            ariaLabel="Field type"
            className="w-auto h-7 pl-2 pr-7 rounded bg-muted/40 text-xs"
          />
        )}

        {/* Delete (non-system) */}
        {!isSystem && field.type !== 'auto' && (
          <button
            onClick={() => onDelete(field.id)}
            className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
          >
            <FiTrash2 size={13} />
          </button>
        )}

        {isSystem && (
          <FiLock size={12} className="text-muted-foreground shrink-0" title="System field" />
        )}
      </div>

      {/* Dropdown options */}
      {field.type === 'select' && !isSystem && (
        <div className="mt-2.5 ml-0">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {field.options.map(o => (
              <span key={o} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted border border-border text-xs font-medium">
                {o}
                <button onClick={() => removeOpt(o)} className="text-muted-foreground hover:text-destructive leading-none">×</button>
              </span>
            ))}
            {field.options.length === 0 && (
              <span className="text-xs text-muted-foreground italic">No options yet</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={optInput}
              onChange={e => setOptInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addOpt()}
              placeholder="Add option & press Enter"
              className="h-7 px-2.5 rounded border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-[#17707B] flex-1 max-w-[220px]"
            />
            <button onClick={addOpt} className="h-7 px-2.5 rounded bg-muted hover:bg-muted-foreground/20 text-xs font-medium transition-colors">
              + Add
            </button>
          </div>
        </div>
      )}

      {/* Readonly options preview */}
      {field.type === 'select' && isSystem && field.options.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {field.options.map(o => (
            <span key={o} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{o}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
export default function CategoriesConfig() {
  const { categories, updateCategories } = useMockStore();

  const [activeCatId, setActiveCatId]         = useState('valve');
  const [newCatName, setNewCatName]           = useState('');
  const [newFieldName, setNewFieldName]       = useState('');
  const [newFieldType, setNewFieldType]       = useState('text');

  const activeCat = categories.find(c => c.id === activeCatId) || categories[0];

  // ── Category CRUD ─────────────────────────────────────────────────────
  const addCategory = () => {
    if (!newCatName.trim()) return;
    const id = newCatName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    updateCategories([...categories, { id, name: newCatName.trim(), description: '', fields: [] }]);
    setActiveCatId(id);
    setNewCatName('');
  };

  const deleteCategory = (id) => {
    const updated = categories.filter(c => c.id !== id);
    updateCategories(updated);
    setActiveCatId(updated[0]?.id);
  };

  const renameCat = (id, name) => {
    updateCategories(categories.map(c => c.id === id ? { ...c, name } : c));
  };

  // ── Field CRUD ────────────────────────────────────────────────────────
  const addField = () => {
    if (!newFieldName.trim() || !activeCat) return;
    const f = { id: 'f-' + Date.now(), name: newFieldName.trim(), type: newFieldType, options: [] };
    updateCategories(categories.map(c => c.id === activeCat.id ? { ...c, fields: [...c.fields, f] } : c));
    setNewFieldName('');
    setNewFieldType('text');
  };

  const updateField = (fieldUpdated) => {
    updateCategories(categories.map(c =>
      c.id === activeCat.id
        ? { ...c, fields: c.fields.map(f => f.id === fieldUpdated.id ? fieldUpdated : f) }
        : c
    ));
  };

  const deleteField = (fieldId) => {
    updateCategories(categories.map(c =>
      c.id === activeCat.id ? { ...c, fields: c.fields.filter(f => f.id !== fieldId) } : c
    ));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Page Header ── */}
      <div className="pb-5 shrink-0">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Categories & Fields</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure BOM component categories. Changes apply seamlessly to the current project.
        </p>
      </div>

      {/* ── Master-Detail Body ── */}
      <div className="flex flex-1 gap-5 overflow-hidden min-h-0 mt-2">

        {/* LEFT: Category List */}
        <div className="w-56 shrink-0 flex flex-col overflow-hidden gap-2">

          {/* Add Category — TOP */}
          <div className="flex gap-1.5 shrink-0">
              <input
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCategory()}
                placeholder="New category…"
                className="flex-1 h-8 px-2.5 rounded-md border border-border bg-muted/30 text-xs focus:outline-none focus:ring-1 focus:ring-[#17707B] min-w-0"
              />
              <button
                onClick={addCategory}
                className="w-8 h-8 rounded-md bg-[#17707B] hover:bg-[#125861] text-white flex items-center justify-center shrink-0 transition-colors"
              >
                <FiPlus size={14} />
              </button>
            </div>

          {/* Category List */}
          <div className="flex-1 overflow-y-auto scrollbar-none space-y-0.5 pr-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCatId(cat.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all text-left",
                  activeCatId === cat.id
                    ? "bg-[#17707B]/10 text-[#17707B] font-semibold"
                    : "text-foreground hover:bg-muted/50 font-medium"
                )}
              >
                <span className="truncate flex-1">{cat.name}</span>
                <span className="text-[11px] text-muted-foreground tabular-nums shrink-0 ml-2">{cat.fields.length}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Fields Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeCat ? (
            <div className="flex flex-col h-full overflow-hidden surface rounded-xl border border-border bg-card shadow-sm">

              {/* Card Header */}
              <div className="px-5 py-4 border-b border-border shrink-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <InlineEdit
                        value={activeCat.name}
                        onSave={name => renameCat(activeCat.id, name)}
                        className="font-bold text-lg text-foreground"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activeCat.description || 'Component category'} · {activeCat.fields.length} field{activeCat.fields.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteCategory(activeCat.id)}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-border text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-colors shrink-0"
                  >
                    <FiTrash2 size={12} /> Delete category
                  </button>
                </div>
              </div>

              {/* Add Field — TOP */}
              <div className="px-4 py-3 border-b border-border bg-muted/10 shrink-0">
                  <div className="flex items-center gap-2">
                    <input
                      value={newFieldName}
                      onChange={e => setNewFieldName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addField()}
                      placeholder="Field name (e.g. Schedule)"
                      className="flex-1 h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-[#17707B] transition-all"
                    />
                    <Select
                      value={newFieldType}
                      onChange={setNewFieldType}
                      options={[
                        { value: 'text', label: 'Text' },
                        { value: 'number', label: 'Number' },
                        { value: 'select', label: 'Dropdown' },
                      ]}
                      allowEmpty={false}
                      ariaLabel="New field type"
                      className="w-auto h-9 pl-2 pr-8 rounded-md shrink-0"
                    />
                    <button
                      onClick={addField}
                      className="h-9 px-4 flex items-center gap-1.5 rounded-md bg-[#17707B] hover:bg-[#125861] text-white text-sm font-medium transition-colors shrink-0"
                    >
                      <FiPlus size={14} /> Add field
                    </button>
                  </div>
                </div>

              {/* Fields List */}
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                {activeCat.fields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm gap-2">
                    <p>No fields yet.</p>
                    <p className="text-xs">Add one above ↑</p>
                  </div>
                ) : (
                  activeCat.fields.map(field => (
                    <FieldRow
                      key={field.id}
                      field={field}
                      isSystem={false}
                      onUpdate={updateField}
                      onDelete={deleteField}
                    />
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Select a category on the left
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
