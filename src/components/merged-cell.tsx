import React from 'react';
import { Project } from '@/types';
import { NameBadgeInput } from './name-badge-input';
import { LinkBadgeInput } from './link-badge-input';
import { useDataState, useDataActions } from '@/lib/data-context';
import { cn } from '@/lib/utils';

interface MergedCellProps {
  project: Project;
  rowSpan: number;
  isLastProject?: boolean;
}

export const MergedCell = React.memo(function MergedCell({ project, rowSpan, isLastProject }: MergedCellProps) {
  const { allOwners, allAccounts } = useDataState();
  const { updateProject } = useDataActions();

  const handleOwnersChange = (newOwners: string[]) => {
    updateProject(project.id, { owners: newOwners });
  };

  const handleAccountsChange = (newAccounts: string[]) => {
    updateProject(project.id, { accounts: newAccounts });
  };

  const handleFilesChange = (newFiles: string[]) => {
    updateProject(project.id, { files: newFiles });
  };

  return (
    <>
      <td rowSpan={rowSpan} className="p-2 border-border-light border-r border-b align-top text-sm relative">
        <NameBadgeInput
          names={project.owners || []}
          onChange={handleOwnersChange}
          availableSuggestions={allOwners}
          placeholder="Add owner..."
          theme="blue"
          openUpwards={isLastProject}
        />
      </td>
      <td rowSpan={rowSpan} className="p-2 border-border-light border-r border-b align-top text-sm">
        <NameBadgeInput
          names={project.accounts || []}
          onChange={handleAccountsChange}
          availableSuggestions={allAccounts}
          placeholder="Add account..."
          theme="rose"
          openUpwards={isLastProject}
        />
      </td>
      <td rowSpan={rowSpan} className={cn("p-2 border-border-light border-b align-top text-sm", isLastProject && "rounded-br-lg")}>
        <LinkBadgeInput
          links={project.files || []}
          onChange={handleFilesChange}
          placeholder="Paste links..."
        />
      </td>
    </>
  );
});
