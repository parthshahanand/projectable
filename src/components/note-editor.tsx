'use client';

import React from 'react';
import { Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Report } from '@/types';
import { cn } from '@/lib/utils';

interface NoteEditorProps {
  report: Report;
  isEditingNote: boolean;
  setIsEditingNote: (val: boolean) => void;
  noteInput: string;
  setNoteInput: (val: string) => void;
  handleSaveNote: () => void;
  className?: string;
  title?: string;
}

export function NoteEditor({
  report,
  isEditingNote,
  setIsEditingNote,
  noteInput,
  setNoteInput,
  handleSaveNote,
  className,
  title = "Notes"
}: NoteEditorProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {title && <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">{title}</h4>}
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
  );
}
