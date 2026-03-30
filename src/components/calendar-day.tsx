import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Report } from '@/types';
import { CalendarBadge } from './calendar-badge';
import { useDataActions } from '@/lib/data-context';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CalendarDayProps {
  date: Dayjs;
  reports: Report[];
  hideDayOfWeek?: boolean;
  monthLabel?: string;
}

export function CalendarDay({ date, reports, hideDayOfWeek, monthLabel }: CalendarDayProps) {
  const isToday = date.isSame(dayjs(), 'day');
  const [isAdding, setIsAdding] = useState(false);
  const [newReportName, setNewReportName] = useState('');
  const [showCountDialog, setShowCountDialog] = useState(false);
  const [reportCount, setReportCount] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createProject } = useDataActions();

  const handleInlineSubmit = () => {
    if (!newReportName.trim()) {
      setIsAdding(false);
      return;
    }
    // Ask for how many reports are in the new project
    setShowCountDialog(true);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(reportCount);
    if (isNaN(num) || num < 1 || num > 100) return;

    setIsSubmitting(true);

    const project = await createProject({
      reportCount: num,
      name: newReportName,
      dueDate: date.format('YYYY-MM-DD'),
    });

    if (project) {
      setNewReportName('');
      setIsAdding(false);
      setShowCountDialog(false);
      setReportCount('1');
    }
    
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInlineSubmit();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewReportName('');
    }
  };

  return (
    <div 
      className="flex-1 border-r border-border-light flex flex-col min-w-[30px] w-full h-full relative transition-colors cursor-pointer hover:bg-amber-100/25"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isAdding) {
          setIsAdding(true);
        }
      }}
    >
      <div className="text-center py-2 pb-2 pointer-events-none">

        {!hideDayOfWeek && (
          <div className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">
            {date.format('ddd')}
          </div>
        )}
        <div className={cn(
          "text-sm font-medium h-6 mx-auto flex items-center justify-center transition-colors",
          !hideDayOfWeek && "mt-0.5",
          monthLabel || isToday ? "px-2.5 rounded-full w-max" : "w-6 rounded-full",
          isToday ? "bg-primary text-primary-foreground" : (monthLabel ? "bg-muted/30 border border-border text-muted-foreground text-xs" : "text-foreground")
        )}>
          {monthLabel || date.format('D')}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1.5 pl-5 pr-1 pb-4 overflow-visible" 
        onClick={(e) => {
          if (e.target === e.currentTarget && !isAdding) setIsAdding(true);
        }}>
        {reports.map(report => (
          <CalendarBadge key={report.id} report={report} />
        ))}
        
        {isAdding && (
          <Popover open={showCountDialog} onOpenChange={(open) => {
            if (!open && !isSubmitting) setShowCountDialog(false);
          }}>
            <PopoverTrigger asChild>
              <input
                autoFocus
                type="text"
                className="w-full text-xs p-1 px-1.5 bg-white border border-border focus:outline-none focus:ring-1 ring-primary rounded-sm shadow-sm relative z-10"
                placeholder="Name..."
                value={newReportName}
                onChange={e => setNewReportName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={(e) => {
                  const newFocus = e.relatedTarget as HTMLElement;
                  const isMovingToPopover = newFocus?.closest('[role="dialog"]');
                  
                  if (!isMovingToPopover) {
                    setTimeout(() => {
                      if (newReportName.trim() !== '') {
                        handleInlineSubmit();
                      } else {
                        setIsAdding(false);
                      }
                    }, 100);
                  }
                }}
              />
            </PopoverTrigger>
            <PopoverContent 
              className="w-72 p-4 shadow-xl" 
              align="start" 
              side="bottom"
              sideOffset={4}
              onClick={(e) => e.stopPropagation()}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
                <div className="space-y-1">
                  <h4 className="font-semibold leading-none">Create New Project</h4>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium leading-none">
                    How many reports does it contain?
                  </label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={reportCount} 
                    onChange={e => setReportCount(e.target.value)} 
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => { setShowCountDialog(false); setIsAdding(false); setNewReportName(''); }}>Cancel</Button>
                  <Button type="submit" size="sm" disabled={isSubmitting}>Create</Button>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
