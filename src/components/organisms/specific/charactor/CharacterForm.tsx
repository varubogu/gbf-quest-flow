import React, { useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { CharacterPosition, Member } from '@/types/models';
import { CharacterIcon } from '@/components/molecules/specific/character/CharacterIcon';
import { SkillDisplay } from '@/components/molecules/specific/character/SkillDisplay';
import { tableCellBaseStyle } from '@/components/styles/TableStyles';
import { textInputBaseStyle } from '@/components/atoms/common/IconTextButton';
import { SuggestTextInput } from '@/components/molecules/common/SuggestTextInput';
import type { SuggestItem } from '@/components/molecules/common/SuggestTextInput';
import { characterAwakeTypeSuggest } from '@/config/suggest';
import { cn } from '@/lib/utils/cn';

interface CharacterFormProps {
  position: CharacterPosition;
  members: Member[];
  isEditing: boolean;
  onMemberChange: (_position: CharacterPosition, _index: number, _field: keyof Member, _value: string) => void;
}

type HandleChange = (_index: number, _field: keyof Member) => (_value: string) => void;

// SuggestTextInput用のカスタムスタイル
const suggestInputStyle = 'border-0 shadow-none p-0';

export const CharacterForm: React.FC<CharacterFormProps> = memo(({
  position,
  members,
  isEditing,
  onMemberChange,
}) => {
  const { t } = useTranslation();

  const handleChange: HandleChange = useCallback((index, field) => (value) => {
    onMemberChange(position, index, field, value);
  }, [position, onMemberChange]);

  /**
   * 覚醒タイプのサジェスト候補を取得する関数
   * @param query - 入力された文字列
   * @returns サジェスト候補のリスト
   */
  const handleAwakeTypeSuggest = useCallback((query: string): SuggestItem[] => {
    return characterAwakeTypeSuggest
      .map(item => ({
        id: String(item.id),
        label: t(item.translationKey) as string
      }))
      .filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase())
      );
  }, []);

  return (
    <>
      {members.map((char, index) => (
        <tr key={`${position}-${index}`} role="row">
          {index === 0 && (
            <th
              className={tableCellBaseStyle}
              rowSpan={members.length}
              role="cell"
              aria-label={t(position === 'front' ? 'characterFront' : 'characterBack') as string}
            >
              {t(position === 'front' ? 'characterFront' : 'characterBack') as string}
            </th>
          )}
          <CharacterIcon
            name={char.name}
            isEditing={isEditing}
            onChange={handleChange(index, 'name')}
            aria-label={t('characterName') as string}
          />
          <SkillDisplay
            text={char.note}
            isEditing={isEditing}
            onChange={handleChange(index, 'note')}
            aria-label={t('characterUsage') as string}
          />
          <td className={tableCellBaseStyle} role="cell">
            {isEditing ? (
              <SuggestTextInput
                defaultValue={char.awaketype}
                onChange={handleChange(index, 'awaketype')}
                onSuggest={handleAwakeTypeSuggest}
                onSelect={(item) => onMemberChange(position, index, 'awaketype', item.label)}
                className={cn(textInputBaseStyle, suggestInputStyle)}
                maxLength={4}
                aria-label={t('characterAwakening') as string}
              />
            ) : (
              char.awaketype
            )}
          </td>
          <SkillDisplay
            text={char.accessories}
            isEditing={isEditing}
            onChange={handleChange(index, 'accessories')}
            aria-label={t('characterAccessories') as string}
          />
          <SkillDisplay
            text={char.limitBonus}
            isEditing={isEditing}
            onChange={handleChange(index, 'limitBonus')}
            aria-label={t('characterLimitBonus') as string}
          />
        </tr>
      ))}
    </>
  );
});