'use client';

import React, { useState } from 'react';
import { 
  CircleCheckBig, 
  Archive, 
  ArchiveRestore,
  Trash2, 
  MoreHorizontal,
  Circle,
  Pencil,
  Plus
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useReportOperations } from '@/lib/use-report-operations';
import { Report } from '@/types';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ReportActionsProps {
  report: Report;
  reportCount: number;
}

interface ActionItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon | React.ElementType;
  label: string;
  active?: boolean;
  destructive?: boolean;
}

const ActionItem = ({ 
  icon: Icon, 
  label, 
  onClick, 
  className, 
  active,
  destructive,
  ...props
}: ActionItemProps) => (
  <button
    {...props}
    onClick={(e) => {
      e.stopPropagation();
      onClick?.(e);
    }}
    className={cn(
      "flex items-center gap-3 w-full px-3 py-2 text-sm transition-colors rounded-md text-left group/item",
      active ? "text-success-text" : (destructive ? "hover:bg-destructive/10 hover:text-destructive text-destructive/80" : "text-muted-foreground hover:text-foreground hover:bg-amber-100/50"),
      className
    )}
  >
    <Icon className={cn("w-4 h-4", active ? "text-success" : (destructive ? "text-destructive/80 group-hover/item:text-destructive" : "text-muted-foreground group-hover/item:text-foreground"))} />
    <span className="font-medium">{label}</span>
  </button>
);

export function ReportActions({ report, reportCount }: ReportActionsProps) {
  const { 
    isEditingNote,
    setIsEditingNote,
    noteInput,
    setNoteInput,
    isAddingReports,
    setIsAddingReports,
    addCountInput,
    setAddCountInput,
    handleToggleComplete,
    handleToggleArchive,
    handleSaveNote,
    handleAddReports,
    handleDelete,
    handleArchiveProject
  } = useReportOperations(report);

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setIsEditingNote(false);
      setNoteInput(report.notes || '');
      setIsAddingReports(false);
      setAddCountInput('1');
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button 
          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground opacity-0 group-hover/name:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-1.5 shadow-xl" align="end">
        <div className="flex flex-col gap-0.5">
          {/* Notes */}
          <div className="flex flex-col gap-1.5 px-2 py-1">
            <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Notes</h4>
            {isEditingNote ? (
              <div className="flex gap-2">
                <Input
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Add a note..."
                  className="h-8 text-sm py-1 bg-white/50 focus:ring-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveNote();
                    if (e.key === 'Escape') {
                      setIsEditingNote(false);
                      setNoteInput(report.notes || '');
                    }
                  }}
                />
                <button
                  onClick={handleSaveNote}
                  className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                >
                  Save
                </button>
              </div>
            ) : report.notes && report.notes.trim().length > 0 ? (
              <div className="bg-amber-100 border border-amber-300 rounded-md p-2 text-sm text-amber-950 break-words flex justify-between items-start gap-2 group">
                <span className="leading-relaxed">{report.notes}</span>
                <button 
                  onClick={() => {
                    setIsEditingNote(true);
                    setNoteInput(report.notes || '');
                  }}
                  className="p-1 hover:bg-amber-200/50 rounded-sm transition-colors text-amber-700 hover:text-amber-900 opacity-0 group-hover:opacity-100 flex-shrink-0"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setIsEditingNote(true);
                  setNoteInput(report.notes || '');
                }}
                className="text-xs font-medium text-muted-foreground hover:text-foreground w-fit flex items-center gap-1 transition-colors"
              >
                <Pencil className="w-3 h-3" />
                Add Note
              </button>
            )}
          </div>

          <div className="h-px bg-border my-1.5 mx-1" />

          <ActionItem 
            icon={report.completed ? CircleCheckBig : Circle} 
            label={report.completed ? "Mark Incomplete" : "Mark Complete"} 
            onClick={handleToggleComplete}
            active={report.completed}
          />

          {isAddingReports ? (
            <div className="flex flex-col gap-2 px-2 py-1.5 bg-muted/40 rounded-md my-0.5" onClick={(e) => e.stopPropagation()}>
              <label className="text-xs font-medium leading-none text-foreground">
                How many reports to add?
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={addCountInput}
                  onChange={(e) => setAddCountInput(e.target.value)}
                  className="h-8 text-sm py-1 bg-white focus:ring-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddReports(report.project_id, parseInt(addCountInput));
                    if (e.key === 'Escape') setIsAddingReports(false);
                  }}
                />
                <Button 
                  size="sm" 
                  onClick={() => handleAddReports(report.project_id, parseInt(addCountInput))}
                  disabled={parseInt(addCountInput) < 1}
                >
                  Add
                </Button>
              </div>
            </div>
          ) : (
            <ActionItem 
              icon={Plus} 
              label="Add more reports" 
              onClick={() => setIsAddingReports(true)}
            />
          )}

          <ActionItem 
            icon={report.archived ? ArchiveRestore : Archive} 
            label={report.archived ? "Restore to Table" : "Archive Report"} 
            onClick={handleToggleArchive}
          />
          
          {reportCount > 1 && !report.archived && (
            <ActionItem 
              icon={Archive} 
              label="Archive Entire Project" 
              onClick={handleArchiveProject}
            />
          )}
          
          <ActionItem
            icon={Trash2}
            label="Delete Report"
            destructive
            onClick={() => {
              handleDelete(reportCount);
              setIsOpen(false);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
