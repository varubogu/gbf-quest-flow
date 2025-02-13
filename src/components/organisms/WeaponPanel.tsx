import React from 'react';

interface WeaponData {
  category: string;
  name: string;
  skill?: string;
  description: string;
}

interface WeaponPanelProps {
  isEditing: boolean;
}

const weapons: WeaponData[] = [
  {
    category: 'メイン',
    name: 'フェニー杖',
    description: '火傷稼ぎ、回復、アビダメ'
  },
  {
    category: '通常武器',
    name: 'ミカ斧',
    description: '与ダメ'
  },
  {
    category: '通常武器',
    name: 'リミパー剣',
    description: '防御、特殊上限\nムゲン剣と合わせて剣4にする'
  },
  // ... 他の武器データ
];

export const WeaponPanel: React.FC<WeaponPanelProps> = ({ isEditing }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">カテゴリ</th>
            <th className="border p-2">武器名</th>
            <th className="border p-2">追加スキル</th>
            <th className="border p-2">解説</th>
          </tr>
        </thead>
        <tbody>
          {weapons.map((weapon, index) => (
            <tr key={index}>
              <td className="border p-2">
                {isEditing ? (
                  <input type="text" defaultValue={weapon.category} className="border p-1 w-full" />
                ) : (
                  weapon.category
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <input type="text" defaultValue={weapon.name} className="border p-1 w-full" />
                ) : (
                  weapon.name
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <input type="text" defaultValue={weapon.skill} className="border p-1 w-full" />
                ) : (
                  weapon.skill
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <textarea defaultValue={weapon.description} className="border p-1 w-full" />
                ) : (
                  weapon.description
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">スキル効果量</h3>
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
    </div>
  );
};