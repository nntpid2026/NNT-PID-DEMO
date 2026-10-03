import React, { useMemo } from 'react';
import { FiZap, FiCircle, FiLayers, FiBox, FiPackage, FiActivity } from 'react-icons/fi';
import { calcInsulation } from '../../../utils/engineering';
import { cn } from '../../../utils/utils';

const TONE = {
  neutral: 'bg-muted/40 border-border text-foreground',
  sky: 'bg-sky-500/10 border-sky-500/25 text-sky-700 dark:text-sky-300',
  primary: 'bg-primary/10 border-primary/30 text-primary',
};

function CalcField({ icon, label, value, unit, tone = 'neutral' }) {
  return (
    <div className={cn('rounded-xl border p-4 transition-colors', TONE[tone])}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">{label}</span>
        <span className="opacity-60" aria-hidden="true">{icon}</span>
      </div>
      <div className="text-2xl font-bold nums leading-none">
        {value ?? <span className="text-sm font-normal opacity-60">—</span>}
        {value && <span className="text-xs font-medium opacity-70 ml-1">{unit}</span>}
      </div>
    </div>
  );
}

/** Live insulation BOQ preview — same formula the Reports module uses. */
export default function InsulationCalcCard({ line }) {
  const calc = useMemo(
    () => calcInsulation(line?.size, line?.insThk, line?.length),
    [line?.size, line?.insThk, line?.length]
  );

  return (
    <div className="surface rounded-2xl p-5 sm:p-6 shadow-sm bg-card border border-border mt-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FiZap size={18} aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Insulation BOQ — live preview</h3>
            <p className="text-xs text-muted-foreground">
              Recalculates the moment you edit size, thickness or length.
            </p>
          </div>
        </div>
        {calc && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <FiActivity size={11} aria-hidden="true" /> Live
          </span>
        )}
      </div>

      {!calc ? (
        <div className="py-10 text-center border-2 border-dashed border-border rounded-xl bg-muted/10">
          <FiZap size={22} className="mx-auto text-muted-foreground/60 mb-2" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Add <span className="font-semibold text-foreground">Pipe Size</span>,{' '}
            <span className="font-semibold text-foreground">Insulation Thickness</span> and{' '}
            <span className="font-semibold text-foreground">Length</span> to generate the BOQ.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <CalcField icon={<FiCircle size={13} />} label="Pipe OD" value={calc.pipeOD} unit="mm" />
          <CalcField icon={<FiCircle size={13} />} label="Ins. OD" value={calc.insOD} unit="mm" />
          <CalcField icon={<FiLayers size={13} />} label="Total Area" value={calc.totalArea} unit="m²" tone="sky" />
          <CalcField icon={<FiLayers size={13} />} label="Area + 10%" value={calc.areaWith10} unit="m²" tone="sky" />
          <CalcField icon={<FiBox size={13} />} label="Rockwool" value={calc.rockwool} unit="kg" tone="primary" />
          <CalcField icon={<FiPackage size={13} />} label="Alu. Cladding" value={calc.aluminium} unit="kg" tone="primary" />
        </div>
      )}
    </div>
  );
}
