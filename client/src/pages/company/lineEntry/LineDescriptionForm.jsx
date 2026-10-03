import React from 'react';
import { FiTag } from 'react-icons/fi';
import FormField from './FormField';
import SectionHeader from './SectionHeader';
import { onEnterNext } from './formNav';

/** Line identity: Line No., Duty, From, To. */
export default function LineDescriptionForm({ line, errors, touched, onUpdate, onBlur, dutyOptions }) {
  const err = (f) => (touched[f] ? errors[f] : undefined);

  return (
    <div
      data-form-root
      onKeyDown={onEnterNext}
      className="surface rounded-2xl p-5 sm:p-8 shadow-sm bg-card border border-border"
    >
      <SectionHeader
        icon={<FiTag size={18} aria-hidden="true" />}
        title="Line identification"
        description={
          <>
            Where this line runs and what it carries. Press{' '}
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono">Enter</kbd>{' '}
            to jump to the next field.
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        <FormField
          label="Line No."
          required
          value={line.no}
          onChange={(v) => onUpdate('no', v)}
          onBlur={() => onBlur('no')}
          error={err('no')}
          placeholder="e.g. 1005"
        />
        <FormField
          label="Duty"
          value={line.duty}
          onChange={(v) => onUpdate('duty', v)}
          onBlur={() => onBlur('duty')}
          options={dutyOptions}
        />
        <FormField
          label="From"
          value={line.from}
          onChange={(v) => onUpdate('from', v)}
          onBlur={() => onBlur('from')}
          placeholder="e.g. P101"
        />
        <FormField
          label="To"
          value={line.to}
          onChange={(v) => onUpdate('to', v)}
          onBlur={() => onBlur('to')}
          placeholder="e.g. VD101"
        />
      </div>
    </div>
  );
}
