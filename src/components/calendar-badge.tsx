import React from 'react';
import { Report } from '@/types';
import { CompletionCircle } from './completion-circle';
import { cn } from '@/lib/utils';
import { ReportDetailPopover } from './report-detail-popover';

interface CalendarBadgeProps {
  report: Report;
}

export function CalendarBadge({ report }: CalendarBadgeProps) {
  return (
    <ReportDetailPopover report={report}>
      <div className={cn(
        "group relative flex items-start gap-1 p-1.5 rounded-sm border text-[11px] leading-tight transition-all",
        report.completed
          ? "bg-success-bg border-success hover:border-success-text shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          : "bg-cyan-500/20 border-cyan-500/20 hover:bg-cyan-500/40 hover:border-cyan-500/50 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
      )}>
        <div className="absolute -left-[18px] top-1/2 -translate-y-1/2">
          <CompletionCircle report={report} className="scale-[0.85] p-0" />
        </div>
        <div className="absolute -right-1 -top-1 z-10 scale-75">
          <div
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              (report.notes && report.notes.trim().length > 0)
                ? "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.4)]"
                : "bg-muted-foreground/30 opacity-0 group-hover:opacity-100 overflow-hidden"
            )}
          />
        </div>
        <span className={cn(
          "line-clamp-3 w-full break-words font-medium",
          report.completed && "line-through text-success-text opacity-70"
        )}>
          {report.name || "Untitled"}
        </span>
      </div>
    </ReportDetailPopover>
  );
}
