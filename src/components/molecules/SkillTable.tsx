import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { WeaponSkillEffect, WeaponSkillTotal } from '@/types/models';
import { useAutoResizeTextArea } from '@/hooks/useAutoResizeTextArea';
import { textareaBaseStyle } from '@/components/atoms/IconTextButton';
import {
  tableBaseStyle,
  tableHeaderRowStyle,
  tableHeaderCellBaseStyle,
  tableCellBaseStyle,
  tableWidthStyles,
} from '@/components/atoms/TableStyles';
import { announceToScreenReader } from '@/utils/accessibility';

interface SkillTableProps {
  isEditing: boolean;
  title: string;
  values: WeaponSkillEffect | WeaponSkillTotal;
  onChange: (_field: keyof (WeaponSkillEffect | WeaponSkillTotal), _value: string) => void;
}

const defaultValues: WeaponSkillEffect = {
  taRate: '',
  hp: '',
  defense: '',
};

// メモ化されたテキストエリアコンポーネント
const MemoizedTextArea = React.memo<{
  value: string;
  onChange: (_e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (_e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  className: string;
  'aria-label': string;
  ref: React.RefObject<HTMLTextAreaElement>;
}>(({ value, onChange, onKeyDown, className, 'aria-label': ariaLabel }) => (
  <textarea
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    className={className}
    aria-label={ariaLabel}
  />
));

MemoizedTextArea.displayName = 'MemoizedTextArea';

// メモ化された表示用テキストコンポーネント
const MemoizedDisplayText = React.memo<{ text: string }>(({ text }) => (
  <>
    {text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ))}
  </>
));

MemoizedDisplayText.displayName = 'MemoizedDisplayText';

export const SkillTable: React.FC<SkillTableProps> = React.memo(({ isEditing, title, values, onChange }) => {
  const { t } = useTranslation(['weapon', 'common']);

  // valuesが未定義の場合はデフォルト値を使用
  const skillValues = values || defaultValues;

  // フックをトップレベルで直接呼び出す
  const taRateRef = useAutoResizeTextArea(skillValues.taRate);
  const hpRef = useAutoResizeTextArea(skillValues.hp);
  const defenseRef = useAutoResizeTextArea(skillValues.defense);

  // キーボードナビゲーションのハンドラー
  const handleKeyDown = useCallback((
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    _currentField: keyof (WeaponSkillEffect | WeaponSkillTotal),
    nextRef: React.RefObject<HTMLTextAreaElement> | null,
    prevRef: React.RefObject<HTMLTextAreaElement> | null
  ) => {
    if (e.key === 'Tab') {
      if (!e.shiftKey && nextRef?.current) {
        // Tabキーで次のフィールドへ
        e.preventDefault();
        nextRef.current.focus();
        const label = nextRef.current.getAttribute('aria-label') || '';
        announceToScreenReader(`${label}に移動しました`);
      } else if (e.shiftKey && prevRef?.current) {
        // Shift+Tabキーで前のフィールドへ
        e.preventDefault();
        prevRef.current.focus();
        const label = prevRef.current.getAttribute('aria-label') || '';
        announceToScreenReader(`${label}に移動しました`);
      }
    }
  }, []);

  // 変更ハンドラーをメモ化
  const handleTaRateChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange('taRate', e.target.value);
  }, [onChange]);

  const handleHpChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange('hp', e.target.value);
  }, [onChange]);

  const handleDefenseChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange('defense', e.target.value);
  }, [onChange]);

  // キーボードイベントハンドラーをメモ化
  const handleTaRateKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    handleKeyDown(e, 'taRate', hpRef, null);
  }, [handleKeyDown, hpRef]);

  const handleHpKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    handleKeyDown(e, 'hp', defenseRef, taRateRef);
  }, [handleKeyDown, defenseRef, taRateRef]);

  const handleDefenseKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    handleKeyDown(e, 'defense', null, hpRef);
  }, [handleKeyDown, hpRef]);

  // ヘッダーテキストをメモ化
  const headerText = useMemo(() => {
    return title === t('skillEffects', { ns: 'weapon' })
      ? t('effectAmount', { ns: 'weapon' })
      : t('totalAmount', { ns: 'weapon' });
  }, [t, title]);

  return (
    <div className="mt-8" role="region" aria-label={title}>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <table className={tableBaseStyle}>
        <thead>
          <tr className={tableHeaderRowStyle}>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles['1/4']}`} scope="col">
              {t('skill', { ns: 'weapon' })}
            </th>
            <th className={`${tableHeaderCellBaseStyle} ${tableWidthStyles['3/4']}`} scope="col">
              {headerText}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className={tableCellBaseStyle} scope="row">{t('taRate', { ns: 'weapon' })}</th>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <MemoizedTextArea
                  value={skillValues.taRate}
                  onChange={handleTaRateChange}
                  onKeyDown={handleTaRateKeyDown}
                  className={textareaBaseStyle}
                  aria-label={t('taRate', { ns: 'weapon' })}
                  ref={taRateRef}
                />
              ) : (
                <MemoizedDisplayText text={skillValues.taRate} />
              )}
            </td>
          </tr>
          <tr>
            <th className={tableCellBaseStyle} scope="row">HP</th>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <MemoizedTextArea
                  value={skillValues.hp}
                  onChange={handleHpChange}
                  onKeyDown={handleHpKeyDown}
                  className={textareaBaseStyle}
                  aria-label="HP"
                  ref={hpRef}
                />
              ) : (
                <MemoizedDisplayText text={skillValues.hp} />
              )}
            </td>
          </tr>
          <tr>
            <th className={tableCellBaseStyle} scope="row">{t('defense', { ns: 'weapon' })}</th>
            <td className={tableCellBaseStyle}>
              {isEditing ? (
                <MemoizedTextArea
                  value={skillValues.defense}
                  onChange={handleDefenseChange}
                  onKeyDown={handleDefenseKeyDown}
                  className={textareaBaseStyle}
                  aria-label={t('defense', { ns: 'weapon' })}
                  ref={defenseRef}
                />
              ) : (
                <MemoizedDisplayText text={skillValues.defense} />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});
