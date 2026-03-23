'use client';

import { AppHeader } from '@/components/app-header';
import { ProjectTable } from '@/components/project-table';
import { MonthCalendar } from '@/components/month-calendar';
import { useDataState } from '@/lib/data-context';
import { Loader2 } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export default function Home() {
  const { isLoading } = useDataState();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <main className="h-screen py-10 pl-10 pr-4 flex flex-col font-sans w-full">
      <AppHeader />
      
      <ResizablePanelGroup orientation="horizontal" className="flex-1 min-h-0 overflow-hidden">
        {/* Left pane: Table */}
        <ResizablePanel defaultSize={40} minSize={20}>
          <div className="overflow-auto h-full pr-2 pb-20 relative">
            <ProjectTable />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right pane: Calendar */}
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="h-full overflow-hidden">
            <MonthCalendar />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
