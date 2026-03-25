'use client';

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { 
  CircleCheckBig, 
  Archive, 
  ArchiveRestore,
  Trash2, 
  Circle,
  ExternalLink,
  Pencil,
  Plus,
  Undo2
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDataState, useDataActions } from '@/lib/data-context';
import { useReportOperations } from '@/lib/use-report-operations';
import { Report, Project } from '@/types';
import { cn } from '@/lib/utils';
import { formatDisplay, formatHref } from '@/lib/format-link';
import { COLOR_OPTIONS, PICKER_COLOR_CLASSES, ReportColor } from '@/lib/colors';



interface ReportDetailPopoverProps {
  report: Report;
  children: React.ReactNode;
}

export function ReportDetailPopover({ report, children }: ReportDetailPopoverProps) {
  const { updateReport } = useDataActions();
  const { projects, reports } = useDataState();
  const [isOpen, setIsOpen] = useState(false);
  
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

  const project = projects.find((p: Project) => p.id === report.project_id);
  const reportCount = reports.filter((r: Report) => r.project_id === report.project_id).length;

  if (!project) return <>{children}</>;

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
        <div onClick={() => setIsOpen(true)}>
          {children}
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-[300px] p-4 shadow-xl flex flex-col gap-3" align="start">
        {/* Header: Name and Due Date */}
        <div>
          <h4 className={cn("font-semibold text-base leading-tight break-words", report.completed && "line-through text-success-text opacity-70")}>
            {report.name || "Untitled"}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {report.due_date ? `Due ${dayjs(report.due_date).format("MMM DD, YYYY")}` : "No due date"}
          </p>
        </div>

        {/* Project Metadata: Owners & Accounts */}
        {(project.owners?.length > 0 || project.accounts?.length > 0) && (
          <div className="flex flex-col gap-1.5">
            {project.owners?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.owners.map(owner => (
                  <Badge key={owner} variant="secondary" className="px-2 py-0.5 text-xs font-medium border bg-sky-100 text-sky-700 border-sky-200">
                    {owner}
                  </Badge>
                ))}
              </div>
            )}
            {project.accounts?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.accounts.map(account => (
                  <Badge key={account} variant="secondary" className="px-2 py-0.5 text-xs font-medium border bg-rose-100 text-rose-700 border-rose-200">
                    {account}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Project Files */}
        {project.files?.length > 0 && (
          <div className="flex flex-col gap-1">
            {project.files.map(link => (
              <a 
                key={link} 
                title={link} 
                href={formatHref(link)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 bg-muted/50 border border-border hover:border-border-strong text-xs px-2 py-1 rounded-sm w-fit max-w-full transition-colors hover:underline text-foreground"
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-70" />
                <span className="truncate font-medium">{formatDisplay(link)}</span>
              </a>
            ))}
          </div>
        )}

        <div className="h-px bg-border my-1" />

        {/* Color Picker */}
        <div className="flex flex-col gap-1.5">
          <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Report Color</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateReport(report.id, { color: null })}
              className={cn(
                "w-5 h-5 rounded-full border border-border transition-all hover:scale-110 flex items-center justify-center",
                !report.color && "ring-2 ring-primary ring-offset-1"
              )}
              title="Default Color"
            >
              <Undo2 className="w-3 h-3 text-muted-foreground" />
            </button>
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color.name}
                onClick={() => updateReport(report.id, { color: color.name })}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all",
                  color.pickerClass,
                  report.color === color.name ? "border-foreground scale-110 shadow-sm" : "border-transparent hover:scale-105"
                )}
                title={color.name}
                aria-label={`Set color to ${color.name}`}
              />
            ))}
          </div>
        </div>

        <div className="h-px bg-border my-1" />

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
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

        <div className="h-px bg-border my-1" />

        {/* Actions */}
        <div className="flex flex-col gap-0.5">
          <button
            onClick={handleToggleComplete}
            className={cn(
              "flex items-center gap-3 w-full px-2 py-1.5 text-sm transition-colors rounded-md text-left hover:bg-amber-100/50 group/item",
              report.completed ? "text-success-text" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {report.completed ? <CircleCheckBig className="w-4 h-4 text-success" /> : <Circle className="w-4 h-4 text-muted-foreground group-hover/item:text-foreground" />}
            <span className="font-medium">{report.completed ? "Mark Incomplete" : "Mark Complete"}</span>
          </button>
          
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
            <button 
              onClick={() => setIsAddingReports(true)}
              className="flex items-center gap-3 w-full px-2 py-1.5 text-sm transition-colors rounded-md text-left hover:bg-amber-100/50 text-muted-foreground hover:text-foreground group/item"
            >
              <Plus className="w-4 h-4 text-muted-foreground group-hover/item:text-foreground" />
              <span className="font-medium">Add more reports</span>
            </button>
          )}

          <button
            onClick={handleToggleArchive}
            className="flex items-center gap-3 w-full px-2 py-1.5 text-sm transition-colors rounded-md text-left hover:bg-amber-100/50 text-muted-foreground hover:text-foreground group/item"
          >
            {report.archived ? <ArchiveRestore className="w-4 h-4 text-muted-foreground group-hover/item:text-foreground" /> : <Archive className="w-4 h-4 text-muted-foreground group-hover/item:text-foreground" />}
            <span className="font-medium">{report.archived ? "Restore to Table" : "Archive Report"}</span>
          </button>
          
          {reportCount > 1 && !report.archived && (
            <button
              onClick={handleArchiveProject}
              className="flex items-center gap-3 w-full px-2 py-1.5 text-sm transition-colors rounded-md text-left hover:bg-amber-100/50 text-muted-foreground hover:text-foreground group/item"
            >
              <Archive className="w-4 h-4 text-muted-foreground group-hover/item:text-foreground" />
              <span className="font-medium">Archive Entire Project</span>
            </button>
          )}
          
          <button
            onClick={() => handleDelete(reportCount)}
            className="flex items-center gap-3 w-full px-2 py-1.5 text-sm transition-colors rounded-md text-left hover:bg-destructive/10 hover:text-destructive text-destructive/80 group/item"
          >
            <Trash2 className="w-4 h-4 text-destructive/80 group-hover/item:text-destructive" />
            <span className="font-medium">Delete Permanently</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
