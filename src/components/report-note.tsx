'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useData } from '@/lib/data-context';
import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';

interface ReportNoteProps {
  reportId: string;
  notes: string | null;
  className?: string;
  trigger?: React.ReactNode;
}

export function ReportNote({ reportId, notes, className, trigger }: ReportNoteProps) {
  const { updateReport } = useData();
  const [inputValue, setInputValue] = useState(notes || '');
  const [prevNotes, setPrevNotes] = useState(notes);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Sync internal input value when notes prop changes (real-time update support)
  if (notes !== prevNotes) {
    setPrevNotes(notes);
    setInputValue(notes || '');
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setIsEditing(false);
    } else if (!notes) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    updateReport(reportId, { notes: inputValue.trim() || null });
    setIsEditing(false);
  };

  const hasNote = notes && notes.trim().length > 0;

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {trigger || (
          <button
            className={cn(
              "relative flex items-center justify-center p-0.5 rounded-full transition-all group",
              hasNote ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              className
            )}
            title={hasNote ? "View Note" : "Add Note"}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className={cn(
                "w-2 h-2 rounded-full transition-all transform duration-200",
                hasNote 
                  ? "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.4)]" 
                  : "bg-muted-foreground/30",
                "group-hover:scale-150 group-hover:w-2.5 group-hover:h-2.5"
              )} 
            />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-3 shadow-xl border-yellow-200 bg-yellow-50" 
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase font-bold text-yellow-800/50 tracking-wider">
              Report Notes
            </label>
            {hasNote && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-yellow-100 rounded-sm transition-colors text-yellow-700 hover:text-yellow-900"
              >
                <Pencil className="w-3 h-3" />
              </button>
            )}
          </div>

          {isEditing || !hasNote ? (
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add a single line note..."
                className="h-8 text-sm py-1 bg-white/50 border-yellow-200 focus:ring-yellow-400"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') {
                    if (hasNote) setIsEditing(false);
                    else setIsOpen(false);
                  }
                }}
              />
              <button
                onClick={handleSave}
                className="text-xs px-2 py-1 bg-yellow-950 text-yellow-50 rounded hover:bg-yellow-900 transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="text-sm py-1 text-yellow-950 break-words font-medium leading-relaxed">
              {notes}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
