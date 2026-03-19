'use client';

import React from 'react';
import { 
  CircleCheckBig, 
  FilePenLine, 
  Archive, 
  ArchiveRestore,
  Trash2, 
  MoreHorizontal,
  Circle
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ReportNote } from './report-note';
import { useData } from '@/lib/data-context';
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
}

const ActionItem = ({ 
  icon: Icon, 
  label, 
  onClick, 
  className, 
  active,
  ...props
}: ActionItemProps) => (
  <button
    {...props}
    onClick={(e) => {
      e.stopPropagation();
      onClick?.(e);
    }}
    className={cn(
      "flex items-center gap-3 w-full px-3 py-2 text-sm transition-colors rounded-md text-left",
      "hover:bg-muted group/item",
      active ? "text-success-text" : "text-muted-foreground hover:text-foreground",
      className
    )}
  >
    <Icon className={cn("w-4 h-4", active ? "text-success" : "text-muted-foreground group-hover/item:text-foreground")} />
    <span className="font-medium">{label}</span>
  </button>
);

export function ReportActions({ report, reportCount }: ReportActionsProps) {
  const { updateReport, deleteReport, deleteProject } = useData();

  const handleToggleComplete = async () => {
    await updateReport(report.id, { completed: !report.completed });
  };

  const handleToggleArchive = async () => {
    await updateReport(report.id, { archived: !report.archived });
  };

  const handleDelete = async () => {
    if (reportCount === 1) {
      await deleteProject(report.project_id);
    } else {
      await deleteReport(report.id);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground opacity-0 group-hover/name:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1.5 shadow-xl" align="end">
        <div className="flex flex-col gap-0.5">
          <ActionItem 
            icon={report.completed ? CircleCheckBig : Circle} 
            label={report.completed ? "Mark Incomplete" : "Mark Complete"} 
            onClick={handleToggleComplete}
            active={report.completed}
          />
          
          <ReportNote 
            reportId={report.id} 
            notes={report.notes} 
            trigger={
              <ActionItem 
                icon={FilePenLine} 
                label={report.notes ? "Edit Note" : "Add Note"} 
              />
            }
          />

          <div className="h-px bg-border my-1 mx-1" />

          <ActionItem 
            icon={report.archived ? ArchiveRestore : Archive} 
            label={report.archived ? "Restore to Table" : "Archive Report"} 
            onClick={handleToggleArchive}
          />
          
          <ActionItem 
            icon={Trash2} 
            label="Delete Permanently" 
            onClick={handleDelete}
            className="hover:bg-destructive/10 hover:text-destructive text-destructive/80"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
