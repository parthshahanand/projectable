'use client';

import React, { useState } from 'react';
import { 
  CircleCheckBig, 
  Archive, 
  ArchiveRestore,
  Trash2, 
  MoreHorizontal,
  Circle,
  Plus
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useReportOperations } from '@/lib/use-report-operations';
import { NoteEditor } from './note-editor';
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
          <NoteEditor
            report={report}
            isEditingNote={isEditingNote}
            setIsEditingNote={setIsEditingNote}
            noteInput={noteInput}
            setNoteInput={setNoteInput}
            handleSaveNote={handleSaveNote}
            className="px-2 py-1"
          />

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
