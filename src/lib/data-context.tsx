'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Project, Report } from '@/types';
import { supabase } from './supabase';

interface DataContextType {
  projects: Project[];
  reports: Report[];
  allOwners: string[];
  allAccounts: string[];
  isLoading: boolean;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  updateReport: (id: string, updates: Partial<Report>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
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

    // Supabase Real-time subscriptions
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
        setProjects((prev) => {
          if (payload.eventType === 'INSERT') return [...prev, payload.new as Project];
          if (payload.eventType === 'UPDATE') return prev.map((p) => p.id === payload.new.id ? payload.new as Project : p);
          if (payload.eventType === 'DELETE') return prev.filter((p) => p.id !== payload.old?.id);
          return prev;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, (payload) => {
        setReports((prev) => {
          if (payload.eventType === 'INSERT') return [...prev, payload.new as Report];
          if (payload.eventType === 'UPDATE') return prev.map((r) => r.id === payload.new.id ? payload.new as Report : r);
          if (payload.eventType === 'DELETE') return prev.filter((r) => r.id !== payload.old?.id);
          return prev;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Compute unique owners and accounts across all projects for the autocomplete feature
  const allOwners = useMemo(() => {
    const owners = new Set<string>();
    projects.forEach((p) => {
      if (p.owners) p.owners.forEach(o => owners.add(o));
    });
    return Array.from(owners).sort();
  }, [projects]);

  const allAccounts = useMemo(() => {
    const accounts = new Set<string>();
    projects.forEach((p) => {
      if (p.accounts) p.accounts.forEach(a => accounts.add(a));
    });
    return Array.from(accounts).sort();
  }, [projects]);

  const updateProject = async (id: string, updates: Partial<Project>) => {
    // Optimistic update
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    const { error } = await supabase.from('projects').update(updates).eq('id', id);
    if (error) {
      // Revert on error? For now, the Realtime listener will eventually correct it if we fetch again, 
      // but a proper revert would be better. However, let's keep it simple as requested.
      console.error('Update project error:', error);
    }
  };

  const updateReport = async (id: string, updates: Partial<Report>) => {
    // Optimistic update
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    const { error } = await supabase.from('reports').update(updates).eq('id', id);
    if (error) {
      console.error('Update report error:', error);
    }
  };

  const deleteProject = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
  };

  const deleteReport = async (id: string) => {
    await supabase.from('reports').delete().eq('id', id);
  };

  return (
    <DataContext.Provider value={{ projects, reports, allOwners, allAccounts, isLoading, updateProject, updateReport, deleteProject, deleteReport }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
