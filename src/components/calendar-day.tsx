import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Report } from '@/types';
import { CalendarBadge } from './calendar-badge';
import { useData } from '@/lib/data-context';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
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
  const { createProject } = useData();

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
      className={cn(
        "flex-1 border-r border-border-light flex flex-col min-w-[30px] w-full h-full relative transition-colors cursor-pointer",
        isToday ? "bg-calendar-today/30" : "hover:bg-muted/30"
      )}
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
          isToday ? "bg-primary text-primary-foreground" : (monthLabel ? "bg-muted/60 text-muted-foreground text-xs" : "text-foreground")
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
          <input
            autoFocus
            type="text"
            className="w-full text-xs p-1 px-1.5 bg-background border border-border focus:outline-none focus:ring-1 ring-primary rounded-sm shadow-sm"
            placeholder="Name..."
            value={newReportName}
            onChange={e => setNewReportName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={(e) => {
              // Only trigger submit if they didn't clear it.
              // We check relatedTarget to see if focus moved to the dialog (which means dialog is opening)
              const newFocus = e.relatedTarget as HTMLElement;
              const isMovingToDialog = newFocus?.closest('[role="dialog"]');
              
              if (!isMovingToDialog) {
                setTimeout(() => {
                  // Only submit if name is not empty
                  if (newReportName.trim() !== '') {
                    handleInlineSubmit();
                  } else {
                    setIsAdding(false);
                  }
                }, 100);
              }
            }}
          />
        )}
      </div>

      <Dialog open={showCountDialog} onOpenChange={(open) => {
        if (!open && !isSubmitting) setShowCountDialog(false);
      }}>
        <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleCreateProject}>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription className="hidden">Create a new inline project and specify the number of reports.</DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <label className="text-sm font-medium leading-none mb-3 block">
                How many reports does this project contain?
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCountDialog(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>Create {reportCount} {parseInt(reportCount) === 1 ? 'Report' : 'Reports'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
