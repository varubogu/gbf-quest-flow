import React, { useState } from 'react';
import { Dialog as HeadlessDialog, Tab as HeadlessTab } from '@headlessui/react';
import { WeaponPanel } from './WeaponPanel';
import { SummonPanel } from './SummonPanel';
import useFlowStore from '@/stores/flowStore';
import type { Member } from '@/types/models';

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrganizationModal: React.FC<OrganizationModalProps> = ({ isOpen, onClose }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { flowData, isEditMode, updateFlowData } = useFlowStore();

  const handleJobChange = (value: string) => {
    if (!flowData) return;
    updateFlowData({
      organization: {
        ...flowData.organization,
        job: value
      }
    });
  };

  const handleMemberChange = (position: 'front' | 'back', index: number, field: keyof Member, value: string) => {
    if (!flowData) return;
    const newMembers = position === 'front'
      ? [...flowData.organization.member.front]
      : [...flowData.organization.member.back];

    newMembers[index] = {
      ...newMembers[index],
      [field]: value
    };

    updateFlowData({
      organization: {
        ...flowData.organization,
        member: {
          ...flowData.organization.member,
          [position]: newMembers
        }
      }
    });
  };

  if (!flowData) return null;

  return (
    <HeadlessDialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* オーバーレイ - クリックで閉じる */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={onClose} />

        {/* モーダルコンテンツ */}
        <div className="flex min-h-screen items-center justify-center p-4">
          <HeadlessDialog.Panel className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl mx-auto">
            {/* 固定サイズのコンテナ */}
            <div className="h-[80vh] md:h-[90vh] flex flex-col">
              <HeadlessTab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                {/* ヘッダー部分 */}
                <div className="flex-none p-4 border-b">
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
                <div className="flex-1 overflow-y-auto p-4">
                  <HeadlessTab.Panels>
                    <HeadlessTab.Panel>
                      {/* ジョブ情報 */}
                      <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4">ジョブ</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-bold">ジョブ</h4>
                            {isEditMode ? (
                              <input
                                type="text"
                                value={flowData.organization.job}
                                onChange={(e) => handleJobChange(e.target.value)}
                                className="border p-2 w-full"
                              />
                            ) : (
                              <p>{flowData.organization.job}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* キャラクター表 */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full border">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border p-2">ポジション</th>
                              <th className="border p-2">キャラ</th>
                              <th className="border p-2">用途</th>
                              <th className="border p-2">覚醒</th>
                              <th className="border p-2">指輪・耳飾り</th>
                              <th className="border p-2">LB</th>
                            </tr>
                          </thead>
                          <tbody>
                            {flowData.organization.member.front.map((char, index) => (
                              <tr key={`front-${index}`}>
                                <td className="border p-2">フロント</td>
                                <td className="border p-2">
                                  {isEditMode ? (
                                    <input
                                      type="text"
                                      value={char.name}
                                      onChange={(e) => handleMemberChange('front', index, 'name', e.target.value)}
                                      className="border p-1 w-full"
                                    />
                                  ) : (
                                    char.name
                                  )}
                                </td>
                                <td className="border p-2">
                                  {isEditMode ? (
                                    <textarea
                                      value={char.note}
                                      onChange={(e) => handleMemberChange('front', index, 'note', e.target.value)}
                                      className="border p-1 w-full"
                                    />
                                  ) : (
                                    char.note.split('\n').map((line, i) => (
                                      <React.Fragment key={i}>
                                        {line}
                                        {i < char.note.split('\n').length - 1 && <br />}
                                      </React.Fragment>
                                    ))
                                  )}
                                </td>
                                <td className="border p-2">
                                  {isEditMode ? (
                                    <input
                                      type="text"
                                      value={char.awaketype}
                                      onChange={(e) => handleMemberChange('front', index, 'awaketype', e.target.value)}
                                      className="border p-1 w-full"
                                    />
                                  ) : (
                                    char.awaketype
                                  )}
                                </td>
                                <td className="border p-2">
                                  {isEditMode ? (
                                    <input
                                      type="text"
                                      value={char.accessories}
                                      onChange={(e) => handleMemberChange('front', index, 'accessories', e.target.value)}
                                      className="border p-1 w-full"
                                    />
                                  ) : (
                                    char.accessories
                                  )}
                                </td>
                                <td className="border p-2">
                                  {isEditMode ? (
                                    <input
                                      type="text"
                                      value={char.limitBonus}
                                      onChange={(e) => handleMemberChange('front', index, 'limitBonus', e.target.value)}
                                      className="border p-1 w-full"
                                    />
                                  ) : (
                                    char.limitBonus
                                  )}
                                </td>
                              </tr>
                            ))}
                            {flowData.organization.member.back.map((char, index) => (
                              <tr key={`back-${index}`}>
                                <td className="border p-2">サブ</td>
                                <td className="border p-2">
                                  {isEditMode ? (
                                    <input
                                      type="text"
                                      value={char.name}
                                      onChange={(e) => handleMemberChange('back', index, 'name', e.target.value)}
                                      className="border p-1 w-full"
                                    />
                                  ) : (
                                    char.name
                                  )}
                                </td>
                                <td className="border p-2">
                                  {isEditMode ? (
                                    <textarea
                                      value={char.note}
                                      onChange={(e) => handleMemberChange('back', index, 'note', e.target.value)}
                                      className="border p-1 w-full"
                                    />
                                  ) : (
                                    char.note.split('\n').map((line, i) => (
                                      <React.Fragment key={i}>
                                        {line}
                                        {i < char.note.split('\n').length - 1 && <br />}
                                      </React.Fragment>
                                    ))
                                  )}
                                </td>
                                <td className="border p-2">
                                  {isEditMode ? (
                                    <input
                                      type="text"
                                      value={char.awaketype}
                                      onChange={(e) => handleMemberChange('back', index, 'awaketype', e.target.value)}
                                      className="border p-1 w-full"
                                    />
                                  ) : (
                                    char.awaketype
                                  )}
                                </td>
                                <td className="border p-2">
                                  {isEditMode ? (
                                    <input
                                      type="text"
                                      value={char.accessories}
                                      onChange={(e) => handleMemberChange('back', index, 'accessories', e.target.value)}
                                      className="border p-1 w-full"
                                    />
                                  ) : (
                                    char.accessories
                                  )}
                                </td>
                                <td className="border p-2">
                                  {isEditMode ? (
                                    <input
                                      type="text"
                                      value={char.limitBonus}
                                      onChange={(e) => handleMemberChange('back', index, 'limitBonus', e.target.value)}
                                      className="border p-1 w-full"
                                    />
                                  ) : (
                                    char.limitBonus
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </HeadlessTab.Panel>

                    <HeadlessTab.Panel>
                      <WeaponPanel isEditing={isEditMode} />
                    </HeadlessTab.Panel>

                    <HeadlessTab.Panel>
                      <SummonPanel isEditing={isEditMode} />
                    </HeadlessTab.Panel>

                    <HeadlessTab.Panel>
                      {/* 動画情報 */}
                      <div className="p-4">
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
                    </HeadlessTab.Panel>

                    <HeadlessTab.Panel>
                      {/* スキル総合値情報 */}
                      <div className="p-4">
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
            </div>
          </HeadlessDialog.Panel>
        </div>
      </div>
    </HeadlessDialog>
  );
};