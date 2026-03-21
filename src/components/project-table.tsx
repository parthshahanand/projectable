import React, { useMemo } from 'react';
import { useData } from '@/lib/data-context';
import { ReportRow } from './report-row';
import { NewProjectPopover } from './new-project-popover';
import { ArchivedTable } from './archived-table';

export function ProjectTable() {
  const { projects, reports } = useData();

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

  return (
    <div className="flex-1 pb-20 pr-6 w-full text-base">
      <div className="border border-border-light rounded-lg bg-background overflow-hidden">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-border-light bg-muted/20 h-9">
              <th className="px-3 font-medium text-muted-foreground text-xs border-r border-border-light w-[120px] rounded-tl-lg text-left">Date Due</th>
              <th className="px-3 font-medium text-muted-foreground text-xs border-r border-border-light min-w-[200px] text-left">Report Name</th>
              <th className="px-3 font-medium text-muted-foreground text-xs border-r border-border-light w-[20%] text-left">Owner(s)</th>
              <th className="px-3 font-medium text-muted-foreground text-xs border-r border-border-light w-[20%] text-left">Accounts</th>
              <th className="px-3 font-medium text-muted-foreground text-xs rounded-tr-lg text-left">File(s)</th>
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
      
      <NewProjectPopover />
      <ArchivedTable />
    </div>
  );
}
