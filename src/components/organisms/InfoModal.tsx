import React, { useState, type JSX } from 'react';
import { Dialog as HeadlessDialog } from '@headlessui/react';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '@/core/stores/editModeStore';
import { textInputBaseStyle, textareaBaseStyle } from '@/components/atoms/IconTextButton';
import { useTranslation } from 'react-i18next';
import { useAutoResizeTextArea } from '@/core/hooks/ui/base/useAutoResizeTextArea';
import { updateFlowData } from '@/core/facades/flowFacade';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps): JSX.Element {
  const { t } = useTranslation();
  const flowData = useFlowStore((state: any) => state.flowData);
  const isEditMode = useEditModeStore((state: any) => state.isEditMode);
  const [formData, setFormData] = useState({ ...flowData });

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
    <HeadlessDialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-50">
        {/* オーバーレイ - クリックで閉じる */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={onClose} />

        {/* モーダルコンテンツ */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <HeadlessDialog.Panel
            id="info-modal"
            role="dialog"
            aria-labelledby="info-modal-title"
            className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl h-[90vh] flex flex-col"
          >
            {/* ヘッダー部分 */}
            <div className="flex-none p-4 border-b bg-white flex items-center justify-between">
              <HeadlessDialog.Title id="info-modal-title" className="text-lg font-medium">
                {t('infoModalTitle')}
              </HeadlessDialog.Title>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label={t('close') as string}
              >
                ✕
              </button>
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
                        <input
                          type="text"
                          value={flowData.quest || ''}
                          onChange={(e) => handleInfoChange('quest', e.target.value)}
                          className={textInputBaseStyle}
                          aria-label={t('quest') as string}
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
                        flowData.note?.split('\n').map((line, i) => (
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
          </HeadlessDialog.Panel>
        </div>
      </div>
    </HeadlessDialog>
  );
}
