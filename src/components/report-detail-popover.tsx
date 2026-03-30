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
  Undo2
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDataState, useDataActions } from '@/lib/data-context';
import { useReportOperations } from '@/lib/use-report-operations';
import { NoteEditor } from './note-editor';
import { AddReportsForm } from './add-reports-form';
import { Report, Project } from '@/types';
import { cn } from '@/lib/utils';
import { formatDisplay, formatHref, isUrl } from '@/lib/format-link';

import { COLOR_OPTIONS } from '@/lib/colors';



interface ReportDetailPopoverProps {
  report: Report;
  children: React.ReactNode;
}

export function ReportDetailPopover({ report, children }: ReportDetailPopoverProps) {
  const { updateReport } = useDataActions();
  const { projects, reports } = useDataState();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isConfirmingArchiveProject, setIsConfirmingArchiveProject] = useState(false);
  const [isConfirmingArchiveReport, setIsConfirmingArchiveReport] = useState(false);
  const [copied, setCopied] = useState(false);

  
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
      setIsConfirmingDelete(false);
      setIsConfirmingArchiveProject(false);
      setIsConfirmingArchiveReport(false);
      setCopied(false);
    }

  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div onClick={() => setIsOpen(true)}>
          {children}
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-[320px] p-4 shadow-xl flex flex-col gap-3" align="start">
        {/* Header: Name and Due Date */}
        <div>
          <h4
            className={cn(
              "font-semibold text-base leading-tight break-words cursor-pointer transition-colors duration-200",
              report.completed ? "line-through text-success-text opacity-70" : "hover:text-primary/70"
            )}
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(report.name || "Untitled");
              setCopied(true);
              setTimeout(() => setCopied(false), 1000);
            }}
          >
            {report.name || "Untitled"}
          </h4>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-muted-foreground">
              {report.due_date ? `Due ${dayjs(report.due_date).format("MMM DD, YYYY")}` : "No due date"}
            </p>
            {copied && (
              <span className="text-success-text text-xs font-bold animate-in fade-in slide-in-from-right-1 duration-200">
                Copied!
              </span>
            )}
          </div>
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
            {project.files.map(link => {
              const isActuallyUrl = isUrl(link);
              return isActuallyUrl ? (
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
              ) : (
                <div 
                  key={link} 
                  className="flex items-center gap-1.5 bg-muted/50 border border-border text-xs px-2 py-1 rounded-sm w-fit max-w-full text-foreground"
                >
                  <span className="truncate font-medium">{link}</span>
                </div>
              );
            })}
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
                "w-6 h-6 rounded-full border border-border transition-all hover:scale-110 flex items-center justify-center",
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

        <NoteEditor
          report={report}
          isEditingNote={isEditingNote}
          setIsEditingNote={setIsEditingNote}
          noteInput={noteInput}
          setNoteInput={setNoteInput}
          handleSaveNote={handleSaveNote}
        />

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
          
          <AddReportsForm
            isAddingReports={isAddingReports}
            setIsAddingReports={setIsAddingReports}
            addCountInput={addCountInput}
            setAddCountInput={setAddCountInput}
            handleAddReports={() => handleAddReports(report.project_id, parseInt(addCountInput))}
            showTrigger={true}
          />

          {isConfirmingArchiveReport ? (
            <div className="flex flex-col gap-2 px-2 py-1.5 bg-muted/50 rounded-md my-0.5 border border-border" onClick={(e) => e.stopPropagation()}>
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
                  onClick={() => setIsConfirmingArchiveReport(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                if (report.archived) {
                  handleToggleArchive();
                  setIsOpen(false);
                } else {
                  setIsConfirmingArchiveReport(true);
                }
              }}
              className="flex items-center gap-3 w-full px-2 py-1.5 text-sm transition-colors rounded-md text-left hover:bg-amber-100/50 text-muted-foreground hover:text-foreground group/item"
            >
              {report.archived ? <ArchiveRestore className="w-4 h-4 text-muted-foreground group-hover/item:text-foreground" /> : <Archive className="w-4 h-4 text-muted-foreground group-hover/item:text-foreground" />}
              <span className="font-medium">{report.archived ? "Restore to Table" : "Archive Report"}</span>
            </button>
          )}
          
          {reportCount > 1 && !report.archived && (
            <>
              {isConfirmingArchiveProject ? (
                <div className="flex flex-col gap-2 px-2 py-1.5 bg-amber-50 rounded-md my-0.5 border border-amber-200" onClick={(e) => e.stopPropagation()}>
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
                <button
                  onClick={() => setIsConfirmingArchiveProject(true)}
                  className="flex items-center gap-3 w-full px-2 py-1.5 text-sm transition-colors rounded-md text-left hover:bg-amber-100/50 text-muted-foreground hover:text-foreground group/item"
                >
                  <Archive className="w-4 h-4 text-muted-foreground group-hover/item:text-foreground" />
                  <span className="font-medium">Archive Entire Project</span>
                </button>
              )}
            </>
          )}
          
          {isConfirmingDelete ? (
            <div className="flex flex-col gap-2 px-2 py-1.5 bg-destructive/5 rounded-md my-0.5 border border-destructive/20" onClick={(e) => e.stopPropagation()}>
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
            <button
              onClick={() => setIsConfirmingDelete(true)}
              className="flex items-center gap-3 w-full px-2 py-1.5 text-sm transition-colors rounded-md text-left hover:bg-destructive/10 hover:text-destructive text-destructive/80 group/item"
            >
              <Trash2 className="w-4 h-4 text-destructive/80 group-hover/item:text-destructive" />
              <span className="font-medium">Delete Permanently</span>
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
