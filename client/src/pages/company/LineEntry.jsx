import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiList, FiSettings, FiX } from 'react-icons/fi';
import { useMockStore } from '../../context/useMockStore';
import { cn } from '../../utils/utils';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import LineListPanel from './lineEntry/LineListPanel';
import LineHeader from './lineEntry/LineHeader';
import SectionNav from './lineEntry/SectionNav';
import LineDescriptionForm from './lineEntry/LineDescriptionForm';
import PipeInsulationForm from './lineEntry/PipeInsulationForm';
import ComponentGrid from './lineEntry/ComponentGrid';
import EmptyLinesState from './lineEntry/EmptyLinesState';
import { validateLine, lineProgress } from './lineEntry/validation';

const DESC_SECTION = 'desc';
const PIPE_SECTION = 'pipe';

export default function LineEntry() {
  const { lines, categories, addLine, duplicateLine, deleteLine, updateLine } = useMockStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const searchRef = useRef(null);
  const saveTimer = useRef(null);

  const [touchedState, setTouchedState] = useState({ lineId: null, fields: {} });
  const [saveState, setSaveState] = useState('saved');
  const [confirm, setConfirm] = useState({ open: false, line: null });
  const [mobileListOpen, setMobileListOpen] = useState(false);

  // ── URL-backed state (deep-linkable + refresh-safe) ───────────────────────
  const setParam = useCallback((key, value) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (value === null || value === undefined || value === '') p.delete(key);
      else p.set(key, String(value));
      return p;
    }, { replace: true });
  }, [setSearchParams]);

  const activeLine = useMemo(() => {
    const id = searchParams.get('line');
    return lines.find((l) => String(l.id) === String(id)) || lines[0] || null;
  }, [lines, searchParams]);

  const activeLineId = activeLine ? activeLine.id : null;
  const activeIndex = lines.findIndex((l) => l.id === activeLineId);

  // ── Sections: Line Description + Pipe & Insulation + component categories ──
  const componentCategories = useMemo(() => categories.filter((c) => !c.system), [categories]);

  const sections = useMemo(() => [
    { id: DESC_SECTION, label: 'Line Description', icon: <FiList aria-hidden="true" />, count: 0 },
    { id: PIPE_SECTION, label: 'Pipe & Insulation', icon: <FiSettings aria-hidden="true" />, count: 0 },
    ...componentCategories.map((c) => ({
      id: c.id,
      label: c.name,
      icon: null,
      count: (activeLine?.components?.[c.id] || []).length,
    })),
  ], [componentCategories, activeLine]);

  const sectionParam = searchParams.get('s');
  const activeSection = sections.some((s) => s.id === sectionParam) ? sectionParam : DESC_SECTION;
  // Forms read best at a comfortable measure; data grids use the full width.
  const isFormSection = activeSection === DESC_SECTION || activeSection === PIPE_SECTION;

  const selectSection = useCallback((id) => setParam('s', id), [setParam]);
  const selectLine = useCallback((id) => setParam('line', id), [setParam]);

  // Prev / next line navigation (hero arrows + Alt+↑/↓).
  const goToOffset = useCallback((offset) => {
    const idx = lines.findIndex((l) => l.id === activeLineId);
    const target = lines[idx + offset];
    if (target) setParam('line', target.id);
  }, [lines, activeLineId, setParam]);

  // Field options come from Categories & Fields — the single source of truth.
  const optionSet = useCallback(
    (catId, index) => categories.find((c) => c.id === catId)?.fields?.[index]?.options || [],
    [categories]
  );
  const dutyOptions = optionSet('duty', 0);
  const sizeOptions = optionSet('pipe', 0);
  const mocOptions = optionSet('pipe', 1);
  const insTypeOptions = optionSet('pipe', 3);

  // ── Validation (per field, only once the field has been touched) ──────────
  const errors = useMemo(() => validateLine(activeLine, lines), [activeLine, lines]);
  const { pct: progressPct, issues: progressIssues } = useMemo(() => lineProgress(activeLine), [activeLine]);
  // Touched fields are scoped per line, so switching lines starts clean without
  // an extra effect (avoids cascading renders).
  const touched = touchedState.lineId === activeLineId ? touchedState.fields : {};
  const touch = useCallback((field) => {
    setTouchedState((s) => {
      const fields = s.lineId === activeLineId ? s.fields : {};
      if (fields[field]) return s;
      return { lineId: activeLineId, fields: { ...fields, [field]: true } };
    });
  }, [activeLineId]);

  // ── Mutations (autosave with a visible Saved/Saving indicator) ────────────
  const update = useCallback((field, value) => {
    if (!activeLine) return;
    updateLine(activeLine.id, field, value);
    setSaveState('saving');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaveState('saved'), 600);
  }, [activeLine, updateLine]);

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const handleNew = useCallback(() => {
    const id = addLine();
    setParam('line', id);
    setParam('s', DESC_SECTION);
    setMobileListOpen(false);
    setSaveState('saved');
    toast.success('New line created');
  }, [addLine, setParam]);

  const handleDuplicate = useCallback((id) => {
    const source = lines.find((l) => l.id === (id ?? activeLineId));
    if (!source) return;
    const newId = duplicateLine(source.id);
    if (newId == null) return;
    setParam('line', newId);
    setParam('s', DESC_SECTION);
    setMobileListOpen(false);
    toast.success(`Line ${source.no || ''} duplicated`.trim());
  }, [activeLineId, duplicateLine, lines, setParam]);

  const requestDelete = useCallback((id) => {
    const target = lines.find((l) => l.id === (id ?? activeLineId));
    if (target) setConfirm({ open: true, line: target });
  }, [activeLineId, lines]);

  const confirmDelete = useCallback(() => {
    const target = confirm.line;
    if (!target) return;
    const idx = lines.findIndex((l) => l.id === target.id);
    const fallback = lines[idx + 1] || lines[idx - 1] || null;
    deleteLine(target.id);
    setParam('line', fallback ? fallback.id : '');
    setConfirm({ open: false, line: null });
    toast.success(`Line ${target.no || ''} deleted`.trim());
  }, [confirm.line, deleteLine, lines, setParam]);

  const componentUpdate = useCallback((categoryId, items) => {
    if (!activeLine) return;
    const next = { ...(activeLine.components || {}), [categoryId]: items };
    update('components', next);
  }, [activeLine, update]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        goToOffset(e.key === 'ArrowUp' ? -1 : 1);
        return;
      }
      if (!(e.ctrlKey || e.metaKey)) return;
      const key = e.key.toLowerCase();
      if (key === 'd') { e.preventDefault(); handleDuplicate(); }
      else if (key === 'k') { e.preventDefault(); searchRef.current?.focus(); }
      else if (key === 's') { e.preventDefault(); setSaveState('saved'); toast.success('All changes saved'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleDuplicate, goToOffset]);

  if (lines.length === 0) {
    return <EmptyLinesState onNew={handleNew} />;
  }

  const renderList = (onPicked) => (
    <LineListPanel
      lines={lines}
      activeLineId={activeLineId}
      onSelect={onPicked}
      onNew={handleNew}
      onDuplicate={handleDuplicate}
      onDelete={requestDelete}
      searchInputRef={searchRef}
      className="w-full"
    />
  );

  return (
    <>
      <div className="flex h-full min-h-0">
        {/* Desktop master rail */}
        <aside className="hidden lg:flex w-[300px] shrink-0 flex-col border-r border-border bg-card overflow-hidden">
          {renderList(selectLine)}
        </aside>

        {/* Detail column */}
        <section className="flex-1 min-w-0 flex flex-col min-h-0 bg-muted/30 workspace-canvas">
          {activeLine ? (
            <>
              <div className="shrink-0 p-4 sm:p-5 pb-0">
                <LineHeader
                  line={activeLine}
                  lineIndex={activeIndex < 0 ? 0 : activeIndex}
                  totalLines={lines.length}
                  saveState={saveState}
                  progress={progressPct}
                  issues={progressIssues}
                  onPrev={() => goToOffset(-1)}
                  onNext={() => goToOffset(1)}
                  onDuplicate={() => handleDuplicate(activeLineId)}
                  onDelete={() => requestDelete(activeLineId)}
                  onOpenList={() => setMobileListOpen(true)}
                />
              </div>

              <div className="shrink-0 px-4 sm:px-5 pt-4">
                <SectionNav sections={sections} active={activeSection} onSelect={selectSection} />
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin p-4 sm:p-5">
                <div
                  key={`${activeLineId}-${activeSection}`}
                  className={cn('animate-fade-up w-full', isFormSection && 'max-w-5xl mx-auto')}
                >
                {activeSection === DESC_SECTION && (
                  <LineDescriptionForm
                    line={activeLine}
                    errors={errors}
                    touched={touched}
                    onUpdate={update}
                    onBlur={touch}
                    dutyOptions={dutyOptions}
                  />
                )}

                {activeSection === PIPE_SECTION && (
                  <PipeInsulationForm
                    line={activeLine}
                    errors={errors}
                    touched={touched}
                    onUpdate={update}
                    onBlur={touch}
                    sizeOptions={sizeOptions}
                    mocOptions={mocOptions}
                    insTypeOptions={insTypeOptions}
                  />
                )}

                {componentCategories.map((cat) => (
                  activeSection === cat.id && (
                    <ComponentGrid
                      key={cat.id}
                      category={cat}
                      items={activeLine.components?.[cat.id] || []}
                      onChange={(items) => componentUpdate(cat.id, items)}
                    />
                  )
                ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyLinesState onNew={handleNew} />
            </div>
          )}
        </section>
      </div>

      {/* Mobile master drawer */}
      {mobileListOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileListOpen(false)} aria-hidden="true" />
          <div className="relative z-10 w-[86%] max-w-[340px] h-full bg-card border-r border-border flex flex-col animate-fade-in-soft">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <span className="text-sm font-bold text-foreground">Switch line</span>
              <button
                type="button"
                onClick={() => setMobileListOpen(false)}
                aria-label="Close line list"
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <FiX size={16} aria-hidden="true" />
              </button>
            </div>
            {renderList((id) => { selectLine(id); setMobileListOpen(false); })}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirm.open}
        tone="danger"
        title="Delete this line?"
        message={`Line ${confirm.line?.no || ''} and all of its components will be removed. This cannot be undone.`}
        confirmLabel="Delete line"
        onConfirm={confirmDelete}
        onCancel={() => setConfirm({ open: false, line: null })}
      />
    </>
  );
}
