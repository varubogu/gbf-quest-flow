import React, { useState } from 'react';
import { Dialog as HeadlessDialog, Tab as HeadlessTab } from '@headlessui/react';
import { WeaponPanel } from './WeaponPanel';
import { SummonPanel } from './SummonPanel';
import { JobPanel } from './JobPanel';
import { CharacterPanel } from './CharacterPanel';
import useFlowStore from '@/stores/flowStore';

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrganizationModal: React.FC<OrganizationModalProps> = ({ isOpen, onClose }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { flowData, isEditMode, updateFlowData } = useFlowStore();

  if (!flowData) return null;

  return (
    <HeadlessDialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-50">
        {/* オーバーレイ - クリックで閉じる */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={onClose} />

        {/* モーダルコンテンツ */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <HeadlessDialog.Panel className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
            <HeadlessTab.Group selectedIndex={selectedTab} onChange={setSelectedTab} className="h-full flex flex-col">
              {/* ヘッダー部分 - 固定 */}
              <div className="flex-none p-4 border-b bg-white">
                <HeadlessTab.List className="flex space-x-1">
                  <HeadlessTab className={({ selected }) =>
                    `px-4 py-2 rounded-t-lg ${selected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`
                  }>
                    ジョブ、キャラ、アビリティ
                  </HeadlessTab>
                  <HeadlessTab className={({ selected }) =>
                    `px-4 py-2 rounded-t-lg ${selected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`
                  }>
                    武器
                  </HeadlessTab>
                  <HeadlessTab className={({ selected }) =>
                    `px-4 py-2 rounded-t-lg ${selected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`
                  }>
                    召喚石
                  </HeadlessTab>
                  <HeadlessTab className={({ selected }) =>
                    `px-4 py-2 rounded-t-lg ${selected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`
                  }>
                    動画
                  </HeadlessTab>
                  <HeadlessTab className={({ selected }) =>
                    `px-4 py-2 rounded-t-lg ${selected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`
                  }>
                    スキル総合値
                  </HeadlessTab>
                </HeadlessTab.List>
              </div>

              {/* スクロール可能なコンテンツ領域 */}
              <div className="flex-1 min-h-0">
                <HeadlessTab.Panels className="h-full">
                  <HeadlessTab.Panel className="h-full overflow-auto">
                    <div className="p-4">
                      {/* ジョブ情報 */}
                      <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4">ジョブ</h3>
                        <JobPanel isEditing={isEditMode} />
                      </div>

                      {/* キャラクター表 */}
                      <div>
                        <h3 className="text-lg font-bold mb-4">キャラクター</h3>
                        <CharacterPanel isEditing={isEditMode} />
                      </div>
                    </div>
                  </HeadlessTab.Panel>

                  <HeadlessTab.Panel className="h-full overflow-auto">
                    <div className="p-4">
                      <WeaponPanel isEditing={isEditMode} />
                    </div>
                  </HeadlessTab.Panel>

                  <HeadlessTab.Panel className="h-full overflow-auto">
                    <div className="p-4">
                      <SummonPanel isEditing={isEditMode} />
                    </div>
                  </HeadlessTab.Panel>

                  <HeadlessTab.Panel className="h-full overflow-auto">
                    <div className="p-4">
                      {/* 動画情報 */}
                      <div>
                        <h3 className="text-lg font-bold mb-4">動画</h3>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={flowData.movie || ''}
                            onChange={(e) => updateFlowData({ movie: e.target.value })}
                            className="border p-2 w-full"
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
                      </div>
                    </div>
                  </HeadlessTab.Panel>

                  <HeadlessTab.Panel className="h-full overflow-auto">
                    <div className="p-4">
                      {/* スキル総合値情報 */}
                      <div>
                        <h3 className="text-lg font-bold mb-4">スキル総合値</h3>
                        <table className="min-w-full border">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border p-2">スキル</th>
                              <th className="border p-2">効果量</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border p-2">TA確率</td>
                              <td className="border p-2">
                                {isEditMode ? (
                                  <input type="text" defaultValue="55" className="border p-1 w-full" />
                                ) : (
                                  "55"
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="border p-2">HP</td>
                              <td className="border p-2">
                                {isEditMode ? (
                                  <input type="text" defaultValue="400" className="border p-1 w-full" />
                                ) : (
                                  "400"
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="border p-2">防御</td>
                              <td className="border p-2">
                                {isEditMode ? (
                                  <input type="text" defaultValue="90（HP100時）" className="border p-1 w-full" />
                                ) : (
                                  "90（HP100時）"
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </HeadlessTab.Panel>
                </HeadlessTab.Panels>
              </div>
            </HeadlessTab.Group>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </HeadlessDialog.Panel>
        </div>
      </div>
    </HeadlessDialog>
  );
};