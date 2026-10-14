'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Project, Report } from '@/types';
import { DataStateContext, DataActionsContext, CreateProjectOptions } from './data-context';
import { createDemoData } from './demo-seed';

// In-memory stand-in for the Supabase-backed DataProvider.
// Changes live only in this tab and reset on refresh.
export const DemoDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Seed on the client so dates are relative to the viewer's "today" and match hydration
  useEffect(() => {
    const seed = createDemoData();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- seeding must wait for the client
    setProjects(seed.projects);
    setReports(seed.reports);
    setIsLoading(false);
  }, []);

  const allOwners = useMemo(() => {
    const owners = new Set<string>();
    projects.forEach(p => p.owners?.forEach(o => owners.add(o)));
    return Array.from(owners).sort();
  }, [projects]);

  const allAccounts = useMemo(() => {
    const accounts = new Set<string>();
    projects.forEach(p => p.accounts?.forEach(a => accounts.add(a)));
    return Array.from(accounts).sort();
  }, [projects]);

  const updateProject = React.useCallback(async (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const updateReport = React.useCallback(async (id: string, updates: Partial<Report>) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const deleteProject = React.useCallback(async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setReports(prev => prev.filter(r => r.project_id !== id));
  }, []);

  const deleteReport = React.useCallback(async (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  }, []);

  const createProject = React.useCallback(async ({ reportCount, name, dueDate }: CreateProjectOptions) => {
    const now = new Date().toISOString();
    const project: Project = { id: crypto.randomUUID(), owners: [], accounts: [], files: [], created_at: now };
    const newReports: Report[] = Array.from({ length: reportCount }).map((_, i) => ({
      id: crypto.randomUUID(),
      project_id: project.id,
      name: i === 0 && name ? name.trim() : `Report ${i + 1}`,
      due_date: i === 0 && dueDate ? dueDate : null,
      completed: false,
      order: i,
      notes: null,
      archived: false,
      color: null,
      created_at: now,
    }));
    setProjects(prev => [...prev, project]);
    setReports(prev => [...prev, ...newReports]);
    return project;
  }, []);

  const addReportsToProject = React.useCallback(async (projectId: string, count: number) => {
    const now = new Date().toISOString();
    setReports(prev => {
      const current = prev.filter(r => r.project_id === projectId);
      const maxOrder = current.length > 0 ? Math.max(...current.map(r => r.order)) : -1;
      const newReports: Report[] = Array.from({ length: count }).map((_, i) => ({
        id: crypto.randomUUID(),
        project_id: projectId,
        name: `Report ${current.length + i + 1}`,
        due_date: null,
        completed: false,
        order: maxOrder + 1 + i,
        notes: null,
        archived: false,
        color: null,
        created_at: now,
      }));
      return [...prev, ...newReports];
    });
  }, []);

  const archiveProject = React.useCallback(async (projectId: string, archive: boolean = true) => {
    setReports(prev => prev.map(r => r.project_id === projectId ? { ...r, archived: archive } : r));
  }, []);

  const stateValue = useMemo(() => ({
    projects, reports, allOwners, allAccounts, isLoading
  }), [projects, reports, allOwners, allAccounts, isLoading]);

  const actionsValue = useMemo(() => ({
    updateProject, updateReport, deleteProject, deleteReport, createProject, addReportsToProject, archiveProject
  }), [updateProject, updateReport, deleteProject, deleteReport, createProject, addReportsToProject, archiveProject]);

  return (
    <DataStateContext.Provider value={stateValue}>
      <DataActionsContext.Provider value={actionsValue}>
        {children}
      </DataActionsContext.Provider>
    </DataStateContext.Provider>
  );
};
