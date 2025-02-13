import React from 'react';
import { Dialog as HeadlessDialog } from '@headlessui/react';
import useFlowStore from '@/stores/flowStore';
import { textInputBaseStyle, textareaBaseStyle, useAutoResizeTextArea } from '@/components/atoms/IconTextButton';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const { flowData, isEditMode, updateFlowData } = useFlowStore();

  if (!flowData) return null;

  const handleInfoChange = (field: string, value: string) => {
    if (!flowData) return;
    updateFlowData({
      [field]: value
    });
  };

  return (
    <HeadlessDialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-50">
        {/* オーバーレイ - クリックで閉じる */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={onClose} />

        {/* モーダルコンテンツ */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <HeadlessDialog.Panel className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl h-[90vh] flex flex-col">
            {/* ヘッダー部分 */}
            <div className="flex-none p-4 border-b bg-white flex items-center justify-between">
              <HeadlessDialog.Title className="text-lg font-medium">
                その他の情報
              </HeadlessDialog.Title>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* コンテンツ部分 */}
            <div className="flex-1 min-h-0 p-6 overflow-auto">
              <table className="min-w-full border">
                <tbody>
                  <tr>
                    <td className="border p-2 bg-gray-50 w-1/3">タイトル</td>
                    <td className="border p-2">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={flowData.title || ''}
                          onChange={(e) => handleInfoChange('title', e.target.value)}
                          className={textInputBaseStyle}
                        />
                      ) : (
                        flowData.title
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 bg-gray-50">クエスト</td>
                    <td className="border p-2">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={flowData.quest || ''}
                          onChange={(e) => handleInfoChange('quest', e.target.value)}
                          className={textInputBaseStyle}
                        />
                      ) : (
                        flowData.quest
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 bg-gray-50">作成者</td>
                    <td className="border p-2">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={flowData.author || ''}
                          onChange={(e) => handleInfoChange('author', e.target.value)}
                          className={textInputBaseStyle}
                        />
                      ) : (
                        flowData.author
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 bg-gray-50">概要</td>
                    <td className="border p-2">
                      {isEditMode ? (
                        <textarea
                          ref={useAutoResizeTextArea(flowData.description || '')}
                          value={flowData.description || ''}
                          onChange={(e) => handleInfoChange('description', e.target.value)}
                          className={textareaBaseStyle}
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
                    <td className="border p-2 bg-gray-50">更新日時</td>
                    <td className="border p-2">
                      {isEditMode ? (
                        <input
                          type="datetime-local"
                          value={flowData.updateDate || ''}
                          onChange={(e) => handleInfoChange('updateDate', e.target.value)}
                          className={textInputBaseStyle}
                        />
                      ) : (
                        flowData.updateDate
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 bg-gray-50">参考動画URL</td>
                    <td className="border p-2">
                      {isEditMode ? (
                        <input
                          type="url"
                          value={flowData.movie || ''}
                          onChange={(e) => handleInfoChange('movie', e.target.value)}
                          className={textInputBaseStyle}
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
                    <td className="border p-2 bg-gray-50">その他ノート</td>
                    <td className="border p-2">
                      {isEditMode ? (
                        <textarea
                          ref={useAutoResizeTextArea(flowData.note || '')}
                          value={flowData.note || ''}
                          onChange={(e) => handleInfoChange('note', e.target.value)}
                          className={textareaBaseStyle}
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
};