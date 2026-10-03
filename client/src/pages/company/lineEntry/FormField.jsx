import React, { useId } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { cn } from '../../../utils/utils';
import Select from '../../../components/ui/Select';

/**
 * Accessible form field used across Line Entry.
 * - <label for> is properly associated with the control (via useId).
 * - Numeric inputs request the decimal keypad on touch devices.
 * - Errors are rendered inline and linked with aria-describedby.
 */
export default function FormField({
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  options = null,
  error,
  hint,
  placeholder,
  required = false,
  disabled = false,
  className,
}) {
  const id = useId();
  const errorId = `${id}-error`;

  const base =
    'w-full h-10 px-3 rounded-lg border bg-background text-sm transition-all shadow-sm ' +
    'focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const state = error
    ? 'border-destructive focus:ring-destructive/40'
    : 'border-border hover:border-primary/50 focus:ring-primary/50';

  return (
    <div className={cn('space-y-1.5 min-w-0', className)}>
      <label htmlFor={id} className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
        {required && <span className="text-destructive ml-0.5" aria-hidden="true">*</span>}
      </label>

      {options ? (
        <Select
          id={id}
          value={value ?? '—'}
          onChange={(v) => onChange(v)}
          onBlur={onBlur}
          options={options}
          placeholder="—"
          emptyValue="—"
          disabled={disabled}
          error={!!error}
          ariaLabel={label}
          describedBy={error ? errorId : undefined}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          inputMode={type === 'number' ? 'decimal' : undefined}
          min={type === 'number' ? 0 : undefined}
          step={type === 'number' ? 'any' : undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(base, state)}
        />
      )}

      {error ? (
        <p id={errorId} className="flex items-center gap-1 text-xs font-medium text-destructive">
          <FiAlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
