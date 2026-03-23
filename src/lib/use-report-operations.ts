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
  const [noteInput, setNoteInput] = useState(report.notes || '');
  const [isAddingReports, setIsAddingReports] = useState(false);
  const [addCountInput, setAddCountInput] = useState('1');

  const handleToggleComplete = async () => {
    await updateReport(report.id, { completed: !report.completed });
  };

  const handleToggleArchive = async () => {
    await updateReport(report.id, { archived: !report.archived });
  };

  const handleSaveNote = async () => {
    await updateReport(report.id, { notes: noteInput.trim() || null });
    setIsEditingNote(false);
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
    noteInput,
    setNoteInput,
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
