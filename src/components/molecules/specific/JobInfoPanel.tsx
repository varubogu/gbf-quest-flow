import React from 'react';
import { useTranslation } from 'react-i18next';
import { textareaBaseStyle } from '@/components/atoms/common/IconTextButton';
import { HybridSuggestInput } from '@/components/molecules/common/HybridSuggestInput';
import type { SuggestItem } from '@/types/suggest';
import { suggestJobs } from '@/core/facades/suggestFacade';
import { tableCellBaseStyle } from '@/components/styles/TableStyles';
import { useAutoResizeTextArea } from '@/core/hooks/ui/base/useAutoResizeTextArea';
import type { Job } from '@/types/types';

interface JobInfoPanelProps {
  job: Job;
  isEditing: boolean;
  onJobChange: (_field: keyof Job, _value: string) => void;
  onJobSelect?: (_item: SuggestItem) => void;
}

export const JobInfoPanel: React.FC<JobInfoPanelProps> = ({
  job,
  isEditing,
  onJobChange,
  onJobSelect,
}) => {
  const { t } = useTranslation();
  const jobNoteRef = useAutoResizeTextArea(job.note);

  return (
    <tr>
      <th className={tableCellBaseStyle}>{t('jobClass')}</th>
      <td className={tableCellBaseStyle}>
        {isEditing ? (
          <HybridSuggestInput
            value={job.name}
            onChange={(value) => onJobChange('name', value)}
            onSelectItem={onJobSelect}
            onSuggest={(query) => suggestJobs(t, query)}
            aria-label={t('jobClass') as string}
          />
        ) : (
          job.name
        )}
      </td>
      <td className={tableCellBaseStyle}>
        {isEditing ? (
          <textarea
            ref={jobNoteRef}
            value={job.note}
            onChange={(e) => onJobChange('note', e.target.value)}
            className={textareaBaseStyle}
          />
        ) : (
          job.note.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < job.note.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))
        )}
      </td>
    </tr>
  );
};
