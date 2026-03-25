import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useDataActions } from '@/lib/data-context';

export function NewProjectPopover() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createProject } = useDataActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(count);
    if (isNaN(num) || num < 1 || num > 100) return;

    setIsSubmitting(true);
    
    const project = await createProject({ reportCount: num });

    if (project) {
      setOpen(false);
      setCount('1');
      
      // Smooth scroll to bottom after briefly waiting for Realtime sync
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 500);
    }
    
    setIsSubmitting(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full mt-4 text-muted-foreground hover:text-foreground hover:bg-amber-100/50 border-dashed bg-transparent border-border-light shadow-none">
          <Plus className="w-4 h-4 mr-2" /> New Project
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4 shadow-xl" align="center" side="top" sideOffset={8}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1">
            <h4 className="font-semibold leading-none">Create New Project</h4>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium leading-none">
              How many reports does it contain?
            </label>
            <Input 
              type="number" 
              min="1" 
              max="100" 
              value={count} 
              onChange={e => setCount(e.target.value)} 
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>Create</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
