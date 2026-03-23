import React from 'react';
import { Report } from '@/types';
import { CompletionCircle } from './completion-circle';
import { cn } from '@/lib/utils';
import { ReportDetailPopover } from './report-detail-popover';

interface CalendarBadgeProps {
  report: Report;
}

export function CalendarBadge({ report }: CalendarBadgeProps) {
  const colorMap: Record<string, string> = {
    red: "bg-red-500/50 border-red-500 text-red-950",
    orange: "bg-orange-500/50 border-orange-500 text-orange-950",
    amber: "bg-amber-500/50 border-amber-500 text-amber-950",
    yellow: "bg-yellow-500/50 border-yellow-500 text-yellow-950",
    lime: "bg-lime-500/50 border-lime-500 text-lime-950",
    green: "bg-green-500/50 border-green-500 text-green-950",
    emerald: "bg-emerald-500/50 border-emerald-500 text-emerald-950",
    teal: "bg-teal-500/50 border-teal-500 text-teal-950",
    cyan: "bg-cyan-500/50 border-cyan-500 text-cyan-950",
    sky: "bg-sky-500/50 border-sky-500 text-sky-950",
    blue: "bg-blue-500/50 border-blue-500 text-blue-950",
    indigo: "bg-indigo-500/50 border-indigo-500 text-indigo-950",
    violet: "bg-violet-500/50 border-violet-500 text-violet-950",
    purple: "bg-purple-500/50 border-purple-500 text-purple-950",
    fuchsia: "bg-fuchsia-500/50 border-fuchsia-500 text-fuchsia-950",
    pink: "bg-pink-500/50 border-pink-500 text-pink-950",
    rose: "bg-rose-500/50 border-rose-500 text-rose-950",
  };

  const badgeStyle = report.completed
    ? "bg-success-bg border-success hover:border-success-text shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
    : report.color 
      ? `${colorMap[report.color] || "bg-muted border-border"}`
      : "bg-cyan-500/20 border-cyan-500/20 hover:bg-cyan-500/40 hover:border-cyan-500/50 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]";

  return (
    <ReportDetailPopover report={report}>
      <div className={cn(
        "group relative flex items-start gap-1 p-1.5 rounded-sm border text-[11px] leading-tight transition-all",
        badgeStyle
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
