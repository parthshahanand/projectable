import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Report } from '@/types';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useData } from '@/lib/data-context';
import { ReportActions } from './report-actions';

import { MergedCell } from './merged-cell';
import { Project } from '@/types';

interface ReportRowProps {
  report: Report;
  reportCount: number;
  isFirst: boolean;
  isLastOfAll?: boolean;
  project: Project;
  isLastProject?: boolean;
}

export const ReportRow = React.memo(function ReportRow({ 
  report, 
  reportCount, 
  isFirst, 
  isLastOfAll, 
  project, 
  isLastProject 
}: ReportRowProps) {
  const { updateReport } = useData();
  const [dateOpen, setDateOpen] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateReport(report.id, { name: e.target.value });
  };

  const handleDateChange = (date: Date | undefined) => {
    const due_date = date ? dayjs(date).format('YYYY-MM-DD') : null;
    updateReport(report.id, { due_date });
    setDateOpen(false);
  };

  return (
    <tr className="group hover:bg-muted/30 transition-colors">
      <td className={cn("p-2 border-border-light border-r w-[120px]", !isLastOfAll && "border-b", isLastOfAll && "rounded-bl-lg")}>
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <button className={cn(
              "flex items-center w-full justify-between text-left text-sm p-1 rounded-sm hover:bg-muted focus:outline-none focus:ring-1 ring-border",
              !report.due_date && "text-muted-foreground",
              report.completed && "opacity-50"
            )}>
              {report.due_date ? dayjs(report.due_date).format("MMM DD") : "Set date"}
              <CalendarIcon className="w-3 h-3 opacity-50 ml-2" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={report.due_date ? new Date(report.due_date + 'T12:00:00') : undefined}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </td>
      <td className={cn("p-2 border-border-light border-r min-w-[200px] relative group/name", !isLastOfAll && "border-b")}>
        <div className="flex justify-between items-center h-full w-full">
          <input 
            type="text" 
            defaultValue={report.name} 
            onBlur={handleNameChange}
            placeholder="Report name..."
            className={cn(
              "w-full bg-transparent border-none outline-none focus:ring-1 ring-border rounded-sm p-1.5 pl-1.5 text-sm transition-all",
              report.completed && "line-through text-success-text"
            )}
          />
          <ReportActions report={report} reportCount={reportCount} />
        </div>
      </td>
      {isFirst && (
        <MergedCell 
          project={project} 
          rowSpan={reportCount} 
          isLastProject={isLastProject} 
        />
      )}
    </tr>
  );
});
