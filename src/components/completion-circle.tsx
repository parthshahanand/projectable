import React from 'react';
import { Circle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useData } from '@/lib/data-context';
import { Report } from '@/types';

export function CompletionCircle({ report, className }: { report: Report; className?: string }) {
  const { updateReport } = useData();

  const toggleComplete = async () => {
    await updateReport(report.id, { completed: !report.completed });
  };

  return (
    <button
      onClick={toggleComplete}
      className={cn(
        "flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground",
        report.completed && "opacity-100 text-success hover:text-success",
        className
      )}
    >
      {report.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
    </button>
  );
}
