import { useState } from 'react';
import { useDataActions } from './data-context';
import { Report } from '@/types';

export function useReportOperations(report: Report) {
  const { 
    updateReport, 
    deleteReport, 
    deleteProject, 
    addReportsToProject, 
    archiveProject 
  } = useDataActions();

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isAddingReports, setIsAddingReports] = useState(false);
  const [addCountInput, setAddCountInput] = useState('1');

  const handleToggleComplete = async () => {
    await updateReport(report.id, { completed: !report.completed });
  };

  const handleToggleArchive = async () => {
    await updateReport(report.id, { archived: !report.archived });
  };

  const handleSaveNote = (content: string | null) => {
    // Fast UI transition: close editor immediately
    setIsEditingNote(false);
    
    // Background update (optimistic UI handles the state)
    // We don't await here to keep the UI snappy
    updateReport(report.id, { notes: content });
  };

  const handleAddReports = async (projectId: string, count: number) => {
    await addReportsToProject(projectId, count);
    setIsAddingReports(false);
    setAddCountInput('1');
  };

  const handleDelete = async (reportCount: number) => {
    if (reportCount === 1) {
      await deleteProject(report.project_id);
    } else {
      await deleteReport(report.id);
    }
  };

  const handleArchiveProject = async () => {
    await archiveProject(report.project_id);
  };

  return {
    isEditingNote,
    setIsEditingNote,
    isAddingReports,
    setIsAddingReports,
    addCountInput,
    setAddCountInput,
    handleToggleComplete,
    handleToggleArchive,
    handleSaveNote,
    handleAddReports,
    handleDelete,
    handleArchiveProject
  };
}
