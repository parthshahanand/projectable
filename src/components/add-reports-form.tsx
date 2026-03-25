'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AddReportsFormProps {
  isAddingReports: boolean;
  setIsAddingReports: (val: boolean) => void;
  addCountInput: string;
  setAddCountInput: (val: string) => void;
  handleAddReports: () => void;
  className?: string;
  showTrigger?: boolean;
}

export function AddReportsForm({
  isAddingReports,
  setIsAddingReports,
  addCountInput,
  setAddCountInput,
  handleAddReports,
  className,
  showTrigger = true
}: AddReportsFormProps) {
  if (isAddingReports) {
    return (
      <div className={cn("flex flex-col gap-2 px-2 py-1.5 bg-muted/40 rounded-md my-0.5", className)} onClick={(e) => e.stopPropagation()}>
        <label className="text-xs font-medium leading-none text-foreground">
          How many reports to add?
        </label>
        <div className="flex gap-2">
          <Input
            value={addCountInput}
            onChange={(e) => setAddCountInput(e.target.value.replace(/[^0-9]/g, ''))}
            className="h-8 text-sm"
            placeholder="1"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddReports();
              if (e.key === 'Escape') setIsAddingReports(false);
            }}
          />
          <Button size="sm" className="h-8 px-3" onClick={handleAddReports}>Add</Button>
        </div>
      </div>
    );
  }

  if (!showTrigger) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setIsAddingReports(true);
      }}
      className={cn(
        "flex items-center gap-3 w-full px-2 py-1.5 text-sm transition-colors rounded-md text-left hover:bg-amber-100/50 text-muted-foreground hover:text-foreground group/item",
        className
      )}
    >
      <Plus className="w-4 h-4 text-muted-foreground group-hover/item:text-foreground" />
      <span className="font-medium">Add Reports</span>
    </button>
  );
}
