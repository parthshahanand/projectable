'use client';

import React, { useState } from 'react';
import { 
  CircleCheckBig, 
  Archive, 
  ArchiveRestore,
  Trash2, 
  MoreHorizontal,
  Circle
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useReportOperations } from '@/lib/use-report-operations';
import { NoteEditor } from './note-editor';
import { AddReportsForm } from './add-reports-form';
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
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isConfirmingArchive, setIsConfirmingArchive] = useState(false);
  const [isConfirmingArchiveProject, setIsConfirmingArchiveProject] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setIsEditingNote(false);
      setIsAddingReports(false);
      setAddCountInput('1');
      setIsConfirmingDelete(false);
      setIsConfirmingArchive(false);
      setIsConfirmingArchiveProject(false);
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
          <ActionItem 
            icon={report.completed ? CircleCheckBig : Circle} 
            label={report.completed ? "Mark Incomplete" : "Mark Complete"} 
            onClick={handleToggleComplete}
            active={report.completed}
          />

          <AddReportsForm
            isAddingReports={isAddingReports}
            setIsAddingReports={setIsAddingReports}
            addCountInput={addCountInput}
            setAddCountInput={setAddCountInput}
            handleAddReports={() => handleAddReports(report.project_id, parseInt(addCountInput))}
            showTrigger={true}
            className="px-3 py-2"
          />
          
          {isConfirmingArchive ? (
            <div className="flex flex-col gap-2 px-3 py-2 bg-muted/50 rounded-md my-0.5 border border-border" onClick={(e) => e.stopPropagation()}>
              <p className="text-[11px] font-bold text-foreground uppercase tracking-tight">Archive this report?</p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-[10px] px-3 font-bold"
                  onClick={() => {
                    handleToggleArchive();
                    setIsOpen(false);
                  }}
                >
                  Yes, Archive
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 text-[10px] px-3 hover:bg-muted"
                  onClick={() => setIsConfirmingArchive(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <ActionItem 
              icon={report.archived ? ArchiveRestore : Archive} 
              label={report.archived ? "Restore to Table" : "Archive Report"} 
              onClick={() => {
                if (report.archived) {
                  handleToggleArchive();
                  setIsOpen(false);
                } else {
                  setIsConfirmingArchive(true);
                }
              }}
            />
          )}
          
          {reportCount > 1 && !report.archived && (
            <>
              {isConfirmingArchiveProject ? (
                <div className="flex flex-col gap-2 px-3 py-2 bg-amber-50 rounded-md my-0.5 border border-amber-200" onClick={(e) => e.stopPropagation()}>
                  <p className="text-[11px] font-bold text-amber-700 uppercase tracking-tight">Archive all {reportCount} reports?</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-[10px] px-3 font-bold border-amber-300 text-amber-800 hover:bg-amber-100"
                      onClick={() => {
                        handleArchiveProject();
                        setIsOpen(false);
                      }}
                    >
                      Yes, Archive
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 text-[10px] px-3 text-amber-600 hover:bg-amber-100/50"
                      onClick={() => setIsConfirmingArchiveProject(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <ActionItem 
                  icon={Archive} 
                  label="Archive Entire Project" 
                  onClick={() => setIsConfirmingArchiveProject(true)}
                />
              )}
            </>
          )}
          
          {isConfirmingDelete ? (
            <div className="flex flex-col gap-2 px-3 py-2 bg-destructive/5 rounded-md my-0.5 border border-destructive/20" onClick={(e) => e.stopPropagation()}>
              <p className="text-[11px] font-bold text-destructive uppercase tracking-tight">Permanently delete?</p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="h-7 text-[10px] px-3 font-bold"
                  onClick={() => {
                    handleDelete(reportCount);
                    setIsOpen(false);
                  }}
                >
                  Yes, Delete
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 text-[10px] px-3 hover:bg-muted"
                  onClick={() => setIsConfirmingDelete(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <ActionItem
              icon={Trash2}
              label="Delete Report"
              destructive
              onClick={() => setIsConfirmingDelete(true)}
            />
          )}
        </div>

        <div className="h-px bg-border my-1.5 mx-1" />

        <NoteEditor
          report={report}
          isEditingNote={isEditingNote}
          setIsEditingNote={setIsEditingNote}
          handleSaveNote={handleSaveNote}
          className="px-2 py-1"
        />
      </PopoverContent>
    </Popover>
  );
}
