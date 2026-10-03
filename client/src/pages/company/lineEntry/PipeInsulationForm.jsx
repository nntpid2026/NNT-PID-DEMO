import React from 'react';
import { FiThermometer, FiLayers } from 'react-icons/fi';
import FormField from './FormField';
import InsulationCalcCard from './InsulationCalcCard';
import SectionHeader from './SectionHeader';
import { onEnterNext } from './formNav';

/** Pipe spec + insulation parameters, with the live BOQ preview below. */
export default function PipeInsulationForm({
  line,
  errors,
  touched,
  onUpdate,
  onBlur,
  sizeOptions,
  mocOptions,
  insTypeOptions,
}) {
  const err = (f) => (touched[f] ? errors[f] : undefined);

  return (
    <>
      <div
        data-form-root
        onKeyDown={onEnterNext}
        className="surface rounded-2xl p-5 sm:p-8 shadow-sm bg-card border border-border"
      >
        <SectionHeader
          icon={<FiThermometer size={18} aria-hidden="true" />}
          title="Pipe & Insulation"
          description="Pipe size, material and thickness drive the insulation BOQ below."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <FormField
            label="Size (NB)"
            value={line.size}
            onChange={(v) => onUpdate('size', v)}
            onBlur={() => onBlur('size')}
            options={sizeOptions}
          />
          <FormField
            label="MOC"
            value={line.moc}
            onChange={(v) => onUpdate('moc', v)}
            onBlur={() => onBlur('moc')}
            options={mocOptions}
          />
          <div className="sm:col-span-2 sm:max-w-xs">
            <FormField
              label="Total Length (m)"
              required
              type="number"
              value={line.length}
              onChange={(v) => onUpdate('length', v)}
              onBlur={() => onBlur('length')}
              error={err('length')}
              placeholder="0"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <h4 className="flex items-center gap-2 font-bold text-foreground mb-4 text-base">
            <FiLayers size={16} className="text-primary" aria-hidden="true" />
            Insulation parameters
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 sm:max-w-xl">
            <FormField
              label="Thickness (mm)"
              type="number"
              value={line.insThk}
              onChange={(v) => onUpdate('insThk', v)}
              onBlur={() => onBlur('insThk')}
              error={err('insThk')}
              placeholder="0"
            />
            <FormField
              label="Insulation Type"
              value={line.insType}
              onChange={(v) => onUpdate('insType', v)}
              onBlur={() => onBlur('insType')}
              options={insTypeOptions}
            />
          </div>
        </div>
      </div>

      <InsulationCalcCard line={line} />
    </>
  );
}
