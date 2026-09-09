import React, { type JSX } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { textInputBaseStyle, textareaBaseStyle } from '@/components/atoms/common/IconTextButton';
import { useTranslation } from 'react-i18next';
import { useAutoResizeTextArea } from '@/core/hooks/ui/base/useAutoResizeTextArea';
import { updateFlowData } from '@/core/facades/flowFacade';
import { HybridSuggestInput } from '@/components/molecules/common/HybridSuggestInput';
import { suggestQuests } from '@/core/facades/suggestFacade';
import type { Flow } from '@/types/models';
import type { FlowStore, EditModeStore } from '@/types/flowStore.types';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps): JSX.Element {
  const { t } = useTranslation();
  const flowData: Flow | null = useFlowStore((state: FlowStore) => state.flowData);
  const isEditMode = useEditModeStore((state: EditModeStore) => state.isEditMode);

  // テキストエリアのref
  const descriptionRef = useAutoResizeTextArea(flowData?.description || '');
  const noteRef = useAutoResizeTextArea(flowData?.note || '');

  if (!flowData) return null;

  const handleInfoChange = (field: string, value: string): void => {
    if (!flowData) return;
    updateFlowData({
      [field]: value,
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogBackdrop />
      <DialogPanel
        id="info-modal"
        role="dialog"
        aria-labelledby="info-modal-title"
        className="w-full max-w-2xl h-[90dvh] flex flex-col"
      >
        <div className="flex-none p-4 border-b bg-card flex items-center justify-between">
          <DialogTitle id="info-modal-title" className="text-lg font-medium">
            {t('infoModalTitle')}
          </DialogTitle>
          <DialogClose label={t('close') as string} />
        </div>

        {/* コンテンツ部分 */}
        <div className="flex-1 min-h-0 p-6 overflow-auto">
          <table className="min-w-full border">
            <tbody>
              <tr>
                <td className="border p-2 bg-gray-50 w-1/3">{t('flowTitle')}</td>
                <td data-testid="info-flow-title" className="border p-2">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={flowData.title || ''}
                      onChange={(e) => handleInfoChange('title', e.target.value)}
                      className={textInputBaseStyle}
                      aria-label={t('flowTitle') as string}
                    />
                  ) : (
                    flowData.title
                  )}
                </td>
              </tr>
              <tr>
                <td className="border p-2 bg-gray-50">{t('quest')}</td>
                <td data-testid="info-flow-quest" className="border p-2">
                  {isEditMode ? (
                    <HybridSuggestInput
                      value={flowData.quest || ''}
                      onChange={(value) => handleInfoChange('quest', value)}
                      onSuggest={(query) => suggestQuests(t, query)}
                      aria-label={t('quest') as string}
                      className={textInputBaseStyle}
                    />
                  ) : (
                    flowData.quest
                  )}
                </td>
              </tr>
              <tr>
                <td className="border p-2 bg-gray-50">{t('author')}</td>
                <td data-testid="info-flow-author" className="border p-2">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={flowData.author || ''}
                      onChange={(e) => handleInfoChange('author', e.target.value)}
                      className={textInputBaseStyle}
                      aria-label={t('author') as string}
                    />
                  ) : (
                    flowData.author
                  )}
                </td>
              </tr>
              <tr>
                <td className="border p-2 bg-gray-50">{t('overview')}</td>
                <td data-testid="info-flow-overview" className="border p-2">
                  {isEditMode ? (
                    <textarea
                      ref={descriptionRef}
                      value={flowData.description || ''}
                      onChange={(e) => handleInfoChange('description', e.target.value)}
                      className={textareaBaseStyle}
                      aria-label={t('overview') as string}
                    />
                  ) : (
                    flowData.description?.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < flowData.description.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))
                  )}
                </td>
              </tr>
              <tr>
                <td className="border p-2 bg-gray-50">{t('updateDate')}</td>
                <td data-testid="info-flow-update-date" className="border p-2">
                  {isEditMode ? (
                    <input
                      type="datetime-local"
                      value={flowData.updateDate || ''}
                      onChange={(e) => handleInfoChange('updateDate', e.target.value)}
                      className={textInputBaseStyle}
                      aria-label={t('updateDate') as string}
                    />
                  ) : (
                    flowData.updateDate
                  )}
                </td>
              </tr>
              <tr>
                <td className="border p-2 bg-gray-50">{t('referenceVideoUrl')}</td>
                <td data-testid="info-flow-reference-video-url" className="border p-2">
                  {isEditMode ? (
                    <input
                      type="url"
                      value={flowData.movie || ''}
                      onChange={(e) => handleInfoChange('movie', e.target.value)}
                      className={textInputBaseStyle}
                      aria-label={t('referenceVideoUrl') as string}
                    />
                  ) : (
                    flowData.movie && (
                      <a
                        href={flowData.movie}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {flowData.movie}
                      </a>
                    )
                  )}
                </td>
              </tr>
              <tr>
                <td className="border p-2 bg-gray-50">{t('otherNotes')}</td>
                <td data-testid="info-flow-other-notes" className="border p-2">
                  {isEditMode ? (
                    <textarea
                      ref={noteRef}
                      value={flowData.note || ''}
                      onChange={(e) => handleInfoChange('note', e.target.value)}
                      className={textareaBaseStyle}
                      aria-label={t('otherNotes') as string}
                    />
                  ) : (
                    flowData.note?.split('\n').map((line: string, i: number) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < flowData.note.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DialogPanel>
    </Dialog>
  );
}
