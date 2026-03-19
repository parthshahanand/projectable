'use client';

import React, { useState } from 'react';
import { useData } from '@/lib/data-context';
import { ArchiveRestore, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

export function ArchivedTable() {
  const { reports, projects, updateReport, deleteReport, deleteProject } = useData();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const archivedReports = reports.filter(r => r.archived);

  if (archivedReports.length === 0) return null;

  const handleUnarchive = async (reportId: string) => {
    await updateReport(reportId, { archived: false });
  };

  const handleDelete = async (reportId: string, projectId: string) => {
    const projectReports = reports.filter(r => r.project_id === projectId);
    if (projectReports.length === 1) {
      await deleteProject(projectId);
    } else {
      await deleteReport(reportId);
    }
  };

  return (
    <div className="mt-24 space-y-4">
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center gap-2 px-1 group w-full"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40 group-hover:text-muted-foreground transition-colors">Archived Reports</span>
        <div className="h-px flex-1 bg-border-light/30 group-hover:bg-border-light/50 transition-colors" />
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/40" />}
      </button>

      {!isCollapsed && (
        <div className="border border-border-light rounded-lg bg-muted/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-light bg-muted/10 h-8">
              <th className="px-3 font-medium text-muted-foreground text-[10px] uppercase border-r border-border-light w-[100px]">Date</th>
              <th className="px-3 font-medium text-muted-foreground text-[10px] uppercase border-r border-border-light">Report Name</th>
              <th className="px-3 font-medium text-muted-foreground text-[10px] uppercase w-[100px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light/50">
            {archivedReports.map((report) => {
              const project = projects.find(p => p.id === report.project_id);
              return (
                <tr key={report.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-3 py-2 text-xs text-muted-foreground border-r border-border-light/50">
                    {report.due_date ? dayjs(report.due_date).format('MMM DD') : '—'}
                  </td>
                  <td className="px-3 py-2 text-xs font-medium text-foreground border-r border-border-light/50">
                    <div className="flex flex-col">
                      <span>{report.name}</span>
                      {project && (
                        <span className="text-[10px] text-muted-foreground/60 font-normal">
                          {project.owners?.join(', ') || 'Unassigned'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleUnarchive(report.id)}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Unarchive"
                      >
                        <ArchiveRestore className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(report.id, report.project_id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
