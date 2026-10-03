import React from 'react';
import { cn } from '../../../utils/utils';

/** Consistent card header used by the Line Entry forms. */
export default function SectionHeader({ icon, title, description, accent = 'primary' }) {
  return (
    <div className="flex items-start gap-3 mb-6 pb-4 border-b border-border">
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
          accent === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary text-foreground'
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="font-bold text-foreground text-lg leading-tight">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </div>
  );
}
