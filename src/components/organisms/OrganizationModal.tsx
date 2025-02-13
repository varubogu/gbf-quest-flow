import React, { useState } from 'react';
import { Dialog as HeadlessDialog, Tab as HeadlessTab } from '@headlessui/react';
import { WeaponPanel } from './WeaponPanel';
import { SummonPanel } from './SummonPanel';

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing?: boolean;
}

interface CharacterData {
  position: string;
  name: string;
  purpose: string;
  awakening: string;
  accessories: string;
  limitBonus: string;
}

const characters: CharacterData[] = [
  {
    position: 'フロント',
    name: 'リミパーシヴァル',
    purpose: 'TA、弱体数、ヒット数など。区間によっては2アビの緊急回避も使える',
    awakening: '防御',
    accessories: 'なし',
    limitBonus: ''
  },
  {
    position: 'フロント',
    name: 'リミゼタ',
    purpose: 'TA、ディスペル、弱体数、アビダメ、ヒット数などほぼすべての予兆で活躍する',
    awakening: '防御',
    accessories: 'なし',
    limitBonus: ''
  },
  {
    position: 'フロント',
    name: 'フェニー',
    purpose: 'アビダメ、耐久など\n他キャラは奥義を打てないことが多いのでFC稼ぎキャラでもある\n自動復活すると耐久力があがるので早めに発動させたい',
    awakening: '連撃',
    accessories: 'なし',
    limitBonus: '耐久系は控えめ、敵対心UP'
  },
  {
    position: 'サブ',
    name: 'アラナン',
    purpose: '基本出ない想定。出た場合はさっさとバースト',
    awakening: '任意',
    accessories: 'なし',
    limitBonus: ''
  },
  {
    position: 'サブ',
    name: 'ミカエル',
    purpose: '加護ブースト目的\n基本表には出ない',
    awakening: '任意',
    accessories: 'なし',
    limitBonus: ''
  }
];

export const OrganizationModal: React.FC<OrganizationModalProps> = ({ isOpen, onClose, isEditing = false }) => {
  const [selectedTab, setSelectedTab] = useState(0);

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
                            {isEditing ? (
                              <input type="text" defaultValue="マナダイバー" className="border p-2 w-full" />
                            ) : (
                              <p>マナダイバー</p>
                            )}
                          </div>
                          <div className="col-span-2">
                            <h4 className="font-bold">用途</h4>
                            {isEditing ? (
                              <input type="text" defaultValue="ダメアビで予兆解除を狙う" className="border p-2 w-full" />
                            ) : (
                              <p>ダメアビで予兆解除を狙う</p>
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
                            {characters.map((char, index) => (
                              <tr key={index}>
                                <td className="border p-2">
                                  {isEditing ? (
                                    <input type="text" defaultValue={char.position} className="border p-1 w-full" />
                                  ) : (
                                    char.position
                                  )}
                                </td>
                                <td className="border p-2">
                                  {isEditing ? (
                                    <input type="text" defaultValue={char.name} className="border p-1 w-full" />
                                  ) : (
                                    char.name
                                  )}
                                </td>
                                <td className="border p-2">
                                  {isEditing ? (
                                    <textarea defaultValue={char.purpose} className="border p-1 w-full" />
                                  ) : (
                                    char.purpose.split('\n').map((line, i) => (
                                      <React.Fragment key={i}>
                                        {line}
                                        {i < char.purpose.split('\n').length - 1 && <br />}
                                      </React.Fragment>
                                    ))
                                  )}
                                </td>
                                <td className="border p-2">
                                  {isEditing ? (
                                    <input type="text" defaultValue={char.awakening} className="border p-1 w-full" />
                                  ) : (
                                    char.awakening
                                  )}
                                </td>
                                <td className="border p-2">
                                  {isEditing ? (
                                    <input type="text" defaultValue={char.accessories} className="border p-1 w-full" />
                                  ) : (
                                    char.accessories
                                  )}
                                </td>
                                <td className="border p-2">
                                  {isEditing ? (
                                    <input type="text" defaultValue={char.limitBonus} className="border p-1 w-full" />
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
                      <WeaponPanel isEditing={isEditing} />
                    </HeadlessTab.Panel>

                    <HeadlessTab.Panel>
                      <SummonPanel isEditing={isEditing} />
                    </HeadlessTab.Panel>

                    <HeadlessTab.Panel>
                      {/* 動画情報 */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold mb-4">動画</h3>
                        {isEditing ? (
                          <input
                            type="text"
                            defaultValue="https://youtube.com/xxxxxxxx"
                            className="border p-2 w-full"
                          />
                        ) : (
                          <a
                            href="https://youtube.com/xxxxxxxx"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            https://youtube.com/xxxxxxxx
                          </a>
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
                                {isEditing ? (
                                  <input type="text" defaultValue="55" className="border p-1 w-full" />
                                ) : (
                                  "55"
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="border p-2">HP</td>
                              <td className="border p-2">
                                {isEditing ? (
                                  <input type="text" defaultValue="400" className="border p-1 w-full" />
                                ) : (
                                  "400"
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="border p-2">防御</td>
                              <td className="border p-2">
                                {isEditing ? (
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