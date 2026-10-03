import React from 'react';
import { cn } from '../utils/utils';

export default function Logo({ admin = false, className, compact = false }) {
  return (
    <div className={cn("flex items-center gap-2 font-bold text-xl tracking-tight", className)}>
      <div
        className={cn(
          "bg-primary text-primary-foreground rounded flex items-center justify-center shrink-0",
          compact ? "w-7 h-7 text-base" : "w-8 h-8"
        )}
      >
        B
      </div>
      {!compact && (
        <span className={cn("text-foreground", admin && "text-slate-100")}>
          BOM<span className="text-primary">→</span>BOQ
        </span>
      )}
      {admin && !compact && (
        <span className="ml-2 px-2 py-0.5 text-[10px] uppercase bg-white/20 text-white rounded-full">
          Admin
        </span>
      )}
    </div>
  );
}
