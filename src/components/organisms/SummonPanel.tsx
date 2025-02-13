import React from 'react';

interface SummonData {
  category: string;
  name: string;
  description: string;
}

interface SummonPanelProps {
  isEditing: boolean;
}

const summons: SummonData[] = [
  {
    category: 'メイン',
    name: '超越アグニス220↑',
    description: '極破加護目的、弱体数や奥義加速も'
  },
  {
    category: 'フレンド',
    name: '超越アグニス220↑',
    description: '同上\n片面極破や連撃率確保済みならルシでも良い'
  },
  {
    category: '通常石',
    name: '黒麒麟3凸',
    description: '事故リカバリ'
  },
  // ... 他の召喚石データ
];

export const SummonPanel: React.FC<SummonPanelProps> = ({ isEditing }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">カテゴリ</th>
            <th className="border p-2">召喚石名</th>
            <th className="border p-2">解説</th>
          </tr>
        </thead>
        <tbody>
          {summons.map((summon, index) => (
            <tr key={index}>
              <td className="border p-2">
                {isEditing ? (
                  <input type="text" defaultValue={summon.category} className="border p-1 w-full" />
                ) : (
                  summon.category
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <input type="text" defaultValue={summon.name} className="border p-1 w-full" />
                ) : (
                  summon.name
                )}
              </td>
              <td className="border p-2">
                {isEditing ? (
                  <textarea defaultValue={summon.description} className="border p-1 w-full" />
                ) : (
                  summon.description.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < summon.description.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};