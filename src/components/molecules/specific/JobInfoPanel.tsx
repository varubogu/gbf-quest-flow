import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  textInputBaseStyle,
  textareaBaseStyle,
} from '@/components/atoms/common/IconTextButton';
import { tableCellBaseStyle } from '@/components/styles/TableStyles';
import { useAutoResizeTextArea } from '@/core/hooks/ui/base/useAutoResizeTextArea';
import type { Job } from '@/types/types';

interface JobInfoPanelProps {
  job: Job;
  isEditing: boolean;
  onJobChange: (_field: keyof Job, _value: string) => void;
}

export const JobInfoPanel: React.FC<JobInfoPanelProps> = ({
  job,
  isEditing,
  onJobChange
}) => {
  const { t } = useTranslation();
  const jobNoteRef = useAutoResizeTextArea(job.note);

  return (
    <tr>
      <th className={tableCellBaseStyle}>{t('jobClass')}</th>
      <td className={tableCellBaseStyle}>
        {isEditing ? (
          <input
            type="text"
            value={job.name}
            onChange={(e) => onJobChange('name', e.target.value)}
            className={textInputBaseStyle}
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