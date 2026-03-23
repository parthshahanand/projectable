import React, { useMemo } from 'react';
import { useDataState } from '@/lib/data-context';
import { ReportRow } from './report-row';
import { NewProjectPopover } from './new-project-popover';
import { ArchivedTable } from './archived-table';
import { useColumnResize } from '@/lib/use-column-resize';

export function ProjectTable() {
  const { projects, reports } = useDataState();
  const { widths, startResize, isResizing } = useColumnResize('projectable-table-cols', [300, 200, 200]);

  // Sort projects by creation date
  const sortedProjects = useMemo(() => 
    [...projects].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ), [projects]);

  // Filter to only projects that have at least one non-archived report
  const visibleProjects = useMemo(() => 
    sortedProjects.filter(project => 
      reports.some(r => r.project_id === project.id && !r.archived)
    ), [sortedProjects, reports]);
  
  const minTableWidth = useMemo(() => 120 + widths.reduce((sum, w) => sum + w, 0) + 150, [widths]);

  return (
    <div className="flex flex-col h-auto pl-0 pr-6 mb-8">
      <div className="h-[1000px] border border-border-light rounded-lg overflow-hidden flex flex-col min-h-0 relative bg-background">
        <div className="flex-1 overflow-auto relative">
          <table className="w-full text-left border-separate border-spacing-0 table-fixed" style={{ minWidth: `${minTableWidth}px` }}>
            <thead>
              <tr className="h-9">
                <th className="px-3 font-medium text-muted-foreground text-xs border-r border-b border-border-light w-[120px] min-w-[120px] max-w-[120px] rounded-tl-lg text-left sticky top-0 z-20 bg-background">Date Due</th>
                            <th style={{ width: `${widths[0]}px` }} className="px-3 font-medium text-muted-foreground text-xs border-r border-b border-border-light text-left relative group/opt sticky top-0 z-20 bg-background">
                Report Name
                <div 
                  className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize transition-colors opacity-0 group-hover/opt:opacity-100 hover:bg-amber-100/50 ${isResizing === 0 ? 'opacity-100 bg-amber-100/80 z-50' : ''}`}
                  onMouseDown={startResize(0)}
                />
              </th>
              
              <th style={{ width: `${widths[1]}px` }} className="px-3 font-medium text-muted-foreground text-xs border-r border-b border-border-light text-left relative group/opt sticky top-0 z-20 bg-background">
                Owner(s)
                <div 
                  className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize transition-colors opacity-0 group-hover/opt:opacity-100 hover:bg-amber-100/50 ${isResizing === 1 ? 'opacity-100 bg-amber-100/80 z-50' : ''}`}
                  onMouseDown={startResize(1)}
                />
              </th>
              
              <th style={{ width: `${widths[2]}px` }} className="px-3 font-medium text-muted-foreground text-xs border-r border-b border-border-light text-left relative group/opt sticky top-0 z-20 bg-background">
                Accounts
                <div 
                  className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize transition-colors opacity-0 group-hover/opt:opacity-100 hover:bg-amber-100/50 ${isResizing === 2 ? 'opacity-100 bg-amber-100/80 z-50' : ''}`}
                  onMouseDown={startResize(2)}
                />
              </th>
              
              <th className="px-3 font-medium text-muted-foreground text-xs border-b border-border-light rounded-tr-lg text-left w-auto min-w-[150px] sticky top-0 z-20 bg-background">
                File(s)
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleProjects.map((project, pIndex) => {
              const projectReports = reports
                .filter(r => r.project_id === project.id && !r.archived)
                .sort((a, b) => a.order - b.order);

              const isLastProject = pIndex === visibleProjects.length - 1;

              return projectReports.map((report, index) => {
                const isLastOfAll = isLastProject && index === projectReports.length - 1;

                return (
                  <ReportRow
                    key={report.id}
                    report={report}
                    reportCount={projectReports.length}
                    isFirst={index === 0}
                    isLastOfAll={isLastOfAll}
                    project={project}
                    isLastProject={isLastProject}
                  />
                );
              });
            })}
          </tbody>
        </table>
        {projects.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No projects found. Click &quot;New Project&quot; to start.
          </div>
        )}
      </div>
      </div>
      
      <NewProjectPopover />
      <ArchivedTable />
    </div>
  );
}
