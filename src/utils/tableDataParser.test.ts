import { parseTabSeparatedText, convertToActions } from './tableDataParser';
import type { Action } from '@/types/models';

describe('parseTabSeparatedText', () => {
  it('タブ区切りのテキストを正しく解析できること', () => {
    const input = 'a\tb\tc\nd\te\tf';
    const expected = [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ];
    expect(parseTabSeparatedText(input)).toEqual(expected);
  });

  it('引用符で囲まれたセルを正しく処理できること', () => {
    const input = '"a,b"\t"c\td"\t"e\nf"\n"g,h"\t"i\tj"\t"k\nl"';
    const expected = [
      ['a,b', 'c\td', 'e\nf'],
      ['g,h', 'i\tj', 'k\nl'],
    ];
    expect(parseTabSeparatedText(input)).toEqual(expected);
  });

  it('エスケープされた引用符を正しく処理できること', () => {
    const input = '"a""b"\t"c""d"';
    const expected = [['a"b', 'c"d']];
    expect(parseTabSeparatedText(input)).toEqual(expected);
  });

  it('空の行を除外すること', () => {
    const input = 'a\tb\tc\n\n\nd\te\tf\n\n';
    const expected = [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ];
    expect(parseTabSeparatedText(input)).toEqual(expected);
  });

  it('空のセルを適切に処理すること', () => {
    const input = 'a\t\tc\n\te\t';
    const expected = [
      ['a', '', 'c'],
      ['', 'e', ''],
    ];
    expect(parseTabSeparatedText(input)).toEqual(expected);
  });
});

describe('convertToActions', () => {
  it('基本的なデータを正しくActionオブジェクトに変換できること', () => {
    const input = [
      ['100%', 'CT', '◎', '×', 'アビリティ1', 'メモ1'],
      ['90%', 'CT2', '○', '△', 'アビリティ2', 'メモ2'],
    ];
    const expected: Partial<Action>[] = [
      {
        hp: '100%',
        prediction: 'CT',
        charge: '◎',
        guard: '×',
        action: 'アビリティ1',
        note: 'メモ1',
      },
      {
        hp: '90%',
        prediction: 'CT2',
        charge: '○',
        guard: '△',
        action: 'アビリティ2',
        note: 'メモ2',
      },
    ];
    expect(convertToActions(input, 'hp')).toEqual(expected);
  });

  it('startFieldから始まるデータを正しく処理できること', () => {
    const input = [
      ['CT', '◎', '×', 'アビリティ1'],
      ['CT2', '○', '△', 'アビリティ2'],
    ];
    const expected: Partial<Action>[] = [
      {
        prediction: 'CT',
        charge: '◎',
        guard: '×',
        action: 'アビリティ1',
      },
      {
        prediction: 'CT2',
        charge: '○',
        guard: '△',
        action: 'アビリティ2',
      },
    ];
    expect(convertToActions(input, 'prediction')).toEqual(expected);
  });

  it('列数が多すぎる場合にエラーを投げること', () => {
    const input = [['a', 'b', 'c', 'd', 'e', 'f', 'g']];
    expect(() => convertToActions(input, 'note')).toThrow('tooManyColumns');
  });

  it('空のセルを含むデータを正しく処理できること', () => {
    const input = [
      ['100%', '', '◎', '', 'アビリティ1', ''],
      ['90%', 'CT2', '', '△', '', 'メモ2'],
    ];
    const expected: Partial<Action>[] = [
      {
        hp: '100%',
        prediction: '',
        charge: '◎',
        guard: '',
        action: 'アビリティ1',
        note: '',
      },
      {
        hp: '90%',
        prediction: 'CT2',
        charge: '',
        guard: '△',
        action: '',
        note: 'メモ2',
      },
    ];
    expect(convertToActions(input, 'hp')).toEqual(expected);
  });
});