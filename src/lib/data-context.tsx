'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Project, Report } from '@/types';
import { supabase } from './supabase';
import { toast } from 'sonner';

interface CreateProjectOptions {
  reportCount: number;
  name?: string;
  dueDate?: string | null;
}

interface DataStateContextType {
  projects: Project[];
  reports: Report[];
  allOwners: string[];
  allAccounts: string[];
  isLoading: boolean;
}

interface DataActionsContextType {
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  updateReport: (id: string, updates: Partial<Report>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  createProject: (options: CreateProjectOptions) => Promise<Project | null>;
  addReportsToProject: (projectId: string, count: number) => Promise<void>;
  archiveProject: (projectId: string, archive?: boolean) => Promise<void>;
}

const DataStateContext = createContext<DataStateContextType | undefined>(undefined);
const DataActionsContext = createContext<DataActionsContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      const [{ data: pData }, { data: rData }] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('reports').select('*')
      ]);
      
      if (pData) setProjects(pData as Project[]);
      if (rData) setReports(rData as Report[]);
      setIsLoading(false);
    };

    fetchInitialData();

    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
        if (payload.eventType === 'INSERT') setProjects(prev => [...prev, payload.new as Project]);
        if (payload.eventType === 'UPDATE') setProjects(prev => prev.map(p => p.id === payload.new.id ? payload.new as Project : p));
        if (payload.eventType === 'DELETE') setProjects(prev => prev.filter(p => p.id !== payload.old?.id));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, (payload) => {
        if (payload.eventType === 'INSERT') setReports(prev => [...prev, payload.new as Report]);
        if (payload.eventType === 'UPDATE') setReports(prev => prev.map(r => r.id === payload.new.id ? payload.new as Report : r));
        if (payload.eventType === 'DELETE') setReports(prev => prev.filter(r => r.id !== payload.old?.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    let prevProjects: Project[] = [];
    setProjects(prev => {
      prevProjects = prev;
      return prev.map(p => p.id === id ? { ...p, ...updates } : p);
    });
    const { error } = await supabase.from('projects').update(updates).eq('id', id);
    if (error) {
      setProjects(prevProjects);
      toast.error('Failed to update project');
    }
  }, []);

  const updateReport = React.useCallback(async (id: string, updates: Partial<Report>) => {
    let prevReports: Report[] = [];
    setReports(prev => {
      prevReports = prev;
      return prev.map(r => r.id === id ? { ...r, ...updates } : r);
    });
    const { error } = await supabase.from('reports').update(updates).eq('id', id);
    if (error) {
      setReports(prevReports);
      toast.error('Failed to update report');
    }
  }, []);

  const deleteProject = React.useCallback(async (id: string) => {
    let prevProjects: Project[] = [];
    setProjects(prev => {
      prevProjects = prev;
      return prev.filter(p => p.id !== id);
    });
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      setProjects(prevProjects);
      toast.error('Failed to delete project');
    }
  }, []);

  const deleteReport = React.useCallback(async (id: string) => {
    let prevReports: Report[] = [];
    setReports(prev => {
      prevReports = prev;
      return prev.filter(r => r.id !== id);
    });
    const { error } = await supabase.from('reports').delete().eq('id', id);
    if (error) {
      setReports(prevReports);
      toast.error('Failed to delete report');
    }
  }, []);

  const createProject = React.useCallback(async ({ reportCount, name, dueDate }: CreateProjectOptions) => {
    const { data: project, error: projectError } = await supabase.from('projects').insert({}).select('id').single();
    if (projectError || !project) {
      toast.error('Failed to create project');
      return null;
    }

    const reportsToInsert = Array.from({ length: reportCount }).map((_, i) => ({
      project_id: project.id,
      name: i === 0 && name ? name.trim() : `Report ${i + 1}`,
      due_date: i === 0 && dueDate ? dueDate : null,
      order: i,
    }));

    const { error: reportError } = await supabase.from('reports').insert(reportsToInsert);
    if (reportError) toast.error('Project created but failed to add reports');

    return project as Project;
  }, []);

  const addReportsToProject = React.useCallback(async (projectId: string, count: number) => {
    const { data: currentReports } = await supabase.from('reports').select('order').eq('project_id', projectId);
    const maxOrder = currentReports && currentReports.length > 0 ? Math.max(...currentReports.map(r => r.order)) : -1;

    const reportsToInsert = Array.from({ length: count }).map((_, i) => ({
      project_id: projectId,
      name: `Report ${(currentReports?.length || 0) + i + 1}`,
      due_date: null,
      order: maxOrder + 1 + i,
    }));

    const { error: reportError } = await supabase.from('reports').insert(reportsToInsert);
    if (reportError) toast.error('Failed to add reports');
  }, []);
  
  const archiveProject = React.useCallback(async (projectId: string, archive: boolean = true) => {
    let prevReports: Report[] = [];
    setReports(prev => {
      prevReports = prev;
      return prev.map(r => r.project_id === projectId ? { ...r, archived: archive } : r);
    });
    const { error } = await supabase.from('reports').update({ archived: archive }).eq('project_id', projectId);
    if (error) {
      setReports(prevReports);
      toast.error('Failed to archive project');
    }
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

export const useData = () => {
  const state = useContext(DataStateContext);
  const actions = useContext(DataActionsContext);
  if (!state || !actions) throw new Error('useData must be used within a DataProvider');
  return { ...state, ...actions };
};

export const useDataState = () => {
  const context = useContext(DataStateContext);
  if (context === undefined) throw new Error('useDataState must be used within a DataProvider');
  return context;
};

export const useDataActions = () => {
  const context = useContext(DataActionsContext);
  if (context === undefined) throw new Error('useDataActions must be used within a DataProvider');
  return context;
};
