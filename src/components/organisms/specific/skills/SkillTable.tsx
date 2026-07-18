import React from 'react';
import { Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { WeaponSkillEffect, WeaponSkillTotal } from '@/types/models';
import type { SkillEffectSettings, SkillEffectValueType } from '@/types/settings';
import skillEffectSettings from '@/content/settings/skillEffects.json';
import { useAutoResizeTextArea } from '@/core/hooks/ui/base/useAutoResizeTextArea';
import { textInputBaseStyle, textareaBaseStyle } from '@/components/atoms/common/IconTextButton';
import { IconButton } from '@/components/atoms/common/IconButton';
import {
  tableBaseStyle,
  tableHeaderRowStyle,
  tableHeaderCellBaseStyle,
  tableCellBaseStyle,
  tableWidthStyles,
} from '@/components/styles/TableStyles';

type SkillValue = WeaponSkillEffect | WeaponSkillTotal;
type SkillField = string;

// スキル効果の項目構成は src/content/settings/skillEffects.json で管理する
const skillFields = (skillEffectSettings as SkillEffectSettings).fields;

// 表示ラベルの翻訳キーは "skill_" + key で参照する(labelKeyは廃止)
const skillLabelKey = (key: string): string => `skill_${key}`;

// 改行を含むテキストを<br>付きで表示する(既存データが改行を含む場合に表示を崩さないため)
const renderMultilineText = (text: string): React.ReactNode =>
  text?.split('\n').map((line, i, lines) => (
    <React.Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </React.Fragment>
  ));

// 効果量をtypeに応じて整形する(値そのものは変更せず表示のみ加工する)
// percentage: 末尾に「%」を付与(マイナスはそのまま)
// add: 符号なし・プラスの場合のみ先頭に「+」を付与(マイナスはそのまま)
const formatEffectValue = (value: string, type: SkillEffectValueType): string => {
  if (!value) return value;
  if (type === 'percentage') {
    return `${value}%`;
  }
  return value.startsWith('-') || value.startsWith('+') ? value : `+${value}`;
};

interface SkillRowProps {
  field: SkillField;
  type: SkillEffectValueType;
  label: string;
  value: string;
  note: string;
  isEditing: boolean;
  onChange: (_field: SkillField, _value: string) => void;
  onNoteChange: (_field: SkillField, _value: string) => void;
  onRemove: (_field: SkillField) => void;
}

const SkillRow: React.FC<SkillRowProps> = ({
  field,
  type,
  label,
  value,
  note,
  isEditing,
  onChange,
  onNoteChange,
  onRemove,
}) => {
  const noteTextareaRef = useAutoResizeTextArea(note);
  const { t } = useTranslation();
  const noteLabel = `${label} ${t('skillEffectNote')}`;

  return (
    <tr>
      <th className={tableCellBaseStyle}>
        <div className="flex items-center justify-between gap-2">
          <label htmlFor={`skill-${field}-value`}>{label}</label>
          {isEditing && (
            <IconButton
              icon={Minus}
              label={t('removeSkillEffect') as string}
              onClick={() => onRemove(field)}
              className="h-6 w-6 shrink-0 rounded-full bg-red-500 text-white hover:bg-red-600"
              data-testid={`skill-remove-${field}`}
            />
          )}
        </div>
      </th>
      <td className={tableCellBaseStyle}>
        {isEditing ? (
          <div className="flex items-center gap-1">
            {type === 'add' && value && !value.startsWith('-') && !value.startsWith('+') && (
              <span className="shrink-0">+</span>
            )}
            <input
              type="text"
              inputMode="decimal"
              id={`skill-${field}-value`}
              data-testid={`skill-${field}-value`}
              value={value}
              onChange={(e) => onChange(field, e.target.value)}
              className={textInputBaseStyle}
              aria-label={label}
            />
            {type === 'percentage' && <span className="shrink-0">%</span>}
          </div>
        ) : (
          renderMultilineText(formatEffectValue(value, type))
        )}
      </td>
      <td className={tableCellBaseStyle}>
        {isEditing ? (
          <textarea
            id={`skill-${field}-note`}
            data-testid={`skill-${field}-note`}
            ref={noteTextareaRef}
            value={note}
            onChange={(e) => onNoteChange(field, e.target.value)}
            className={textareaBaseStyle}
            aria-label={noteLabel}
          />
        ) : (
          renderMultilineText(note)
        )}
      </td>
    </tr>
  );
};

interface SkillTableProps {
  id: string;
  isEditing: boolean;
  titleKey: string;
  values: SkillValue;
  notes: SkillValue;
  onChange: (_field: SkillField, _value: string) => void;
  onNoteChange: (_field: SkillField, _value: string) => void;
  onRemove: (_field: SkillField) => void;
}

export const SkillTable: React.FC<SkillTableProps> = ({
  id,
  isEditing,
  titleKey,
  values,
  notes,
  onChange,
  onNoteChange,
  onRemove,
}) => {
  const { t } = useTranslation();

  const safeValues = values ?? {};
  const safeNotes = notes ?? {};
  const presentFields = skillFields.filter(({ key }) =>
    Object.prototype.hasOwnProperty.call(safeValues, key)
  );
  const availableFields = skillFields.filter(
    ({ key }) => !Object.prototype.hasOwnProperty.call(safeValues, key)
  );

  const handleAddSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const key = e.target.value;
    if (key) {
      onChange(key, '');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">{t(titleKey)}</h3>
      <table id={id} className={tableBaseStyle} data-testid={id}>
        <thead>
          <tr className={tableHeaderRowStyle}>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles['1/4']}`}>
              {t('skill')}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles.sm}`}>
              {t('effectAmount')}
            </th>
            <th className={tableHeaderCellBaseStyle}>{t('skillEffectNote')}</th>
          </tr>
        </thead>
        <tbody>
          {presentFields.map(({ key, type }) => (
            <SkillRow
              key={key}
              field={key}
              type={type}
              label={t(skillLabelKey(key)) as string}
              value={safeValues[key] ?? ''}
              note={safeNotes[key] ?? ''}
              isEditing={isEditing}
              onChange={onChange}
              onNoteChange={onNoteChange}
              onRemove={onRemove}
            />
          ))}
          {isEditing && (
            <tr>
              <th className={tableCellBaseStyle}>
                {availableFields.length > 0 ? (
                  <select
                    value=""
                    onChange={handleAddSelect}
                    aria-label={t('selectSkillToAdd') as string}
                    data-testid={`${id}-add-select`}
                    className="w-full rounded border p-1"
                  >
                    <option value="" disabled>
                      {t('selectSkillToAdd')}
                    </option>
                    {availableFields.map(({ key }) => (
                      <option key={key} value={key}>
                        {t(skillLabelKey(key))}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-sm text-gray-400">{t('noMoreSkillEffectsToAdd')}</span>
                )}
              </th>
              <td className={tableCellBaseStyle}></td>
              <td className={tableCellBaseStyle}></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
