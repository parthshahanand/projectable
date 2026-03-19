import React from 'react';
import { Project } from '@/types';
import { NameBadgeInput } from './name-badge-input';
import { LinkBadgeInput } from './link-badge-input';
import { useData } from '@/lib/data-context';

interface MergedCellProps {
  project: Project;
  rowSpan: number;
  isLastProject?: boolean;
}

export const MergedCell = React.memo(function MergedCell({ project, rowSpan, isLastProject }: MergedCellProps) {
  const { allOwners, allAccounts, updateProject } = useData();

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
      <td rowSpan={rowSpan} className={`p-2 border-border-light border-r align-top text-sm relative ${!isLastProject ? 'border-b' : ''}`}>
        <NameBadgeInput
          names={project.owners || []}
          onChange={handleOwnersChange}
          availableSuggestions={allOwners}
          placeholder="Add owner..."
          theme="blue"
        />
      </td>
      <td rowSpan={rowSpan} className={`p-2 border-border-light border-r align-top text-sm ${!isLastProject ? 'border-b' : ''}`}>
        <NameBadgeInput
          names={project.accounts || []}
          onChange={handleAccountsChange}
          availableSuggestions={allAccounts}
          placeholder="Add account..."
          theme="amber"
        />
      </td>
      <td rowSpan={rowSpan} className={`p-2 border-border-light align-top text-sm ${!isLastProject ? 'border-b' : 'rounded-br-lg'}`}>
        <LinkBadgeInput
          links={project.files || []}
          onChange={handleFilesChange}
          placeholder="Paste links..."
        />
      </td>
    </>
  );
});
