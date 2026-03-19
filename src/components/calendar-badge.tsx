import React from 'react';
import { Report } from '@/types';
import { CompletionCircle } from './completion-circle';
import { ReportNote } from './report-note';
import { cn } from '@/lib/utils';

interface CalendarBadgeProps {
  report: Report;
}

export function CalendarBadge({ report }: CalendarBadgeProps) {
  return (
    <div className={cn(
      "group relative flex items-start gap-1 p-1.5 rounded-sm border text-[11px] leading-tight transition-all",
      report.completed 
        ? "bg-success-bg border-success-bg/50" 
        : "bg-[var(--iris-3)] border-[var(--iris-5)] hover:border-[var(--iris-7)] cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
    )}>
      <div className="absolute -left-[18px] top-1/2 -translate-y-1/2">
        <CompletionCircle report={report} className="scale-[0.85] p-0" />
      </div>
      <div className="absolute -right-1 -top-1 z-10 scale-75">
        <ReportNote reportId={report.id} notes={report.notes} />
      </div>
      <span className={cn(
        "line-clamp-3 w-full break-words font-medium",
        report.completed && "line-through text-success-text opacity-70"
      )}>
        {report.name || "Untitled"}
      </span>
    </div>
  );
}
