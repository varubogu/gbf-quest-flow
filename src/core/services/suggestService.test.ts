import { describe, it, expect, beforeEach } from 'vitest';
import {
  filterSuggestItems,
  getChargeSuggestItems,
  getJobSuggestItems,
  getNameSuggestItems,
  rememberSuggestValue,
} from './suggestService';

describe('suggestService', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('空クエリでは先頭の候補を返す', () => {
    const items = filterSuggestItems(
      [
        { id: 'a', label: 'アーマーブレイク' },
        { id: 'b', label: 'レイジ' },
      ],
      '',
      1
    );
    expect(items).toEqual([{ id: 'a', label: 'アーマーブレイク' }]);
  });

  it('部分一致で絞り込む', () => {
    const items = getChargeSuggestItems('〇');
    expect(items.some((item) => item.label === '〇')).toBe(true);
  });

  it('ジョブ名を翻訳キーから候補化する', () => {
    const t = (key: string): string => (key === 'viking' ? 'ヴァイキング' : key);
    const items = getJobSuggestItems(t, 'ヴァイ');
    expect(items.some((item) => item.id === 'viking')).toBe(true);
  });

  it('入力履歴を保存して候補に出す', () => {
    rememberSuggestValue('character', 'サンダルフォン');
    const items = getNameSuggestItems('character', 'サン');
    expect(items[0]?.label).toBe('サンダルフォン');
  });
});
