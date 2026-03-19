import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function NewReportDialog() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(count);
    if (isNaN(num) || num < 1 || num > 100) return;

    setIsSubmitting(true);
    
    // Create project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert({})
      .select('id')
      .single();

    if (projectData && !projectError) {
      // Create reports
      const reportsToInsert = Array.from({ length: num }).map((_, i) => ({
        project_id: projectData.id,
        name: `Report ${i + 1}`,
        order: i
      }));

      await supabase.from('reports').insert(reportsToInsert);
    }
    
    setIsSubmitting(false);
    setOpen(false);
    setCount('1');
    
    // Smooth scroll to bottom after briefly waiting for Realtime sync
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4 text-muted-foreground hover:text-foreground border-dashed bg-transparent border-border-light shadow-none">
          <Plus className="w-4 h-4 mr-2" /> New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed mb-3 block">
              How many reports does this project contain?
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Create {count} {parseInt(count) === 1 ? 'Report' : 'Reports'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
