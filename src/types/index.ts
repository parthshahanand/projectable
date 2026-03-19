export interface Project {
  id: string; // uuid
  owners: string[];
  accounts: string[];
  files: string[];
  created_at: string;
}

export interface Report {
  id: string; // uuid
  project_id: string;
  name: string;
  due_date: string | null;
  completed: boolean;
  order: number;
  notes: string | null;
  archived: boolean;
  created_at: string;
}

// Omit id and created_at for insert structures
export type InsertProject = Omit<Project, 'id' | 'created_at'>;
export type InsertReport = Omit<Report, 'id' | 'created_at'>;
