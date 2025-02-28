import React, { useState } from 'react';
import { Dialog as HeadlessDialog, Tab as HeadlessTab } from '@headlessui/react';
import { WeaponPanel } from './WeaponPanel/index';
import { SummonPanel } from './SummonPanel';
import { JobPanel } from './JobPanel';
import { CharacterPanel } from './CharacterPanel/index';
import { SkillTotalPanel } from './SkillTotalPanel';
import useBaseFlowStoreFacade from '@/core/facades/baseFlowStoreFacade';
import useEditModeStoreFacade from '@/core/facades/editModeStoreFacade';
import { useTranslation } from 'react-i18next';

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrganizationModal: React.FC<OrganizationModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);
  const flowData = useBaseFlowStoreFacade((state: any) => state.flowData);
  const isEditMode = useEditModeStoreFacade((state: any) => state.isEditMode);
  const updateFlowData = useBaseFlowStoreFacade((state: any) => state.updateFlowData);

  if (!flowData) return null;

  return (
    <HeadlessDialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-50">
        {/* オーバーレイ - クリックで閉じる */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={onClose} />

        {/* モーダルコンテンツ */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <HeadlessDialog.Panel
            id="organization-modal"
            role="dialog"
            aria-labelledby="organization-modal-title"
            className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
            <HeadlessTab.Group
              selectedIndex={selectedTab}
              onChange={setSelectedTab}
              className="h-full flex flex-col"
            >
              {/* ヘッダー部分 - 固定 */}
              <div className="flex-none p-4 border-b bg-white">
                <HeadlessTab.List className="flex space-x-1">
                  <HeadlessTab
                    className={({ selected }) =>
                      `px-4 py-2 rounded-t-lg ${selected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`
                    }
                  >
                    {t('jobAndCharacters')}
                  </HeadlessTab>
                  <HeadlessTab
                    className={({ selected }) =>
                      `px-4 py-2 rounded-t-lg ${selected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`
                    }
                  >
                    {t('weapons')}
                  </HeadlessTab>
                  <HeadlessTab
                    className={({ selected }) =>
                      `px-4 py-2 rounded-t-lg ${selected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`
                    }
                  >
                    {t('summons')}
                  </HeadlessTab>
                  <HeadlessTab
                    className={({ selected }) =>
                      `px-4 py-2 rounded-t-lg ${selected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`
                    }
                  >
                    {t('video')}
                  </HeadlessTab>
                  <HeadlessTab
                    className={({ selected }) =>
                      `px-4 py-2 rounded-t-lg ${selected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`
                    }
                  >
                    {t('skillTotals')}
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
                        <h3 className="text-lg font-bold mb-4">{t('job')}</h3>
                        <JobPanel isEditing={isEditMode} />
                      </div>

                      {/* キャラクター表 */}
                      <div>
                        <h3 className="text-lg font-bold mb-4">{t('characters')}</h3>
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
                      <div id="video-panel">
                        <h3 className="text-lg font-bold mb-4">{t('video')}</h3>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={flowData.movie || ''}
                            onChange={(e) => updateFlowData({ movie: e.target.value })}
                            className="border p-2 w-full"
                            aria-label={t('video') as string}
                          />
                        ) : (
                          flowData.movie && (
                            <a
                              href={flowData.movie}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                              aria-label={t('video') as string}
                            >
                              {flowData.movie}
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </HeadlessTab.Panel>

                  <HeadlessTab.Panel className="h-full overflow-auto">
                    <div id="skill-total-tab-panel" className="p-4">
                      {/* スキル総合値情報 */}
                      <div id="skill-total-panel-content">
                        <SkillTotalPanel isEditing={isEditMode} />
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
