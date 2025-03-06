import type { Flow } from '@/types/models';
import { displayUnknownError, displayValidationError } from '@/core/services/errorDisplayService';
import { announceToScreenReader, handleError } from '@/lib/utils/accessibility';

/**
 * ファイル操作関連のサービス
 *
 * このサービスは、ファイルの選択、読み込み、保存などの純粋なファイル操作機能を提供します。
 */

// ロジック関数 - JSONファイルを読み込む
export async function readJsonFile(file: File): Promise<Flow> {
  const text = await file.text();
  return JSON.parse(text) as Flow;
}

// ロジック関数 - ファイル選択用のinput要素を作成
export function createFileInput(): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  return input;
}

// ロジック関数 - ファイル選択処理
export async function selectFile(): Promise<File | null> {
  const input = createFileInput();
  document.body.appendChild(input); // DOMに追加して確実に動作するようにする

  const filePromise = new Promise<File | null>((resolve) => {
    // フォーカスイベントの処理を改善
    window.addEventListener(
      'focus',
      () => {
        onFocus(input, resolve);
      },
      { once: true }
    );

    input.onchange = fileOnChange(resolve);
  });

  input.click();
  return await filePromise;
}

// ロジック関数 - JSONデータをファイルに保存
export async function saveJsonToFile(data: Flow, fileName?: string): Promise<void> {
  // JSONデータを生成
  const jsonData = JSON.stringify(data, null, 2);

  // Blobを作成
  const blob = new Blob([jsonData], { type: 'application/json' });

  // ダウンロードリンクを作成
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  // ファイル名を設定（指定がない場合はフローのタイトルを使用）
  const defaultFileName = `${data.title || 'flow'}.json`;
  link.download = fileName || defaultFileName;

  // リンクをクリックしてダウンロードを開始
  document.body.appendChild(link);
  link.click();

  // クリーンアップ
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function fileOnChange(resolve: (_value: File | null) => void): (_e: Event) => void {
  return (e: Event): void => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    resolve(file || null);

    // 使用後はDOMから削除
    if (input.parentNode) {
      input.parentNode.removeChild(input);
    }
  };
}

function onFocus(input: HTMLInputElement, resolve: (_value: File | null) => void): void {
  // タイムアウトを長めに設定し、ダイアログのキャンセルを確実に検出
  setTimeout(() => {
    // ファイルが選択されていない場合はnullを返す
    if (!input.files?.length) {
      resolve(null);
    }
    // 使用後はDOMから削除
    if (input.parentNode) {
      input.parentNode.removeChild(input);
    }
  }, 500);
}

// エラーハンドリング関数
export function handleFileOperationError(error: unknown, defaultMessage: string): void {
  if (error instanceof Error) {
    displayUnknownError(error);
  } else {
    displayValidationError(defaultMessage);
  }
}

// FileOperations.tsから移行した関数
/**
 * フローデータをダウンロードする
 * @param flowData ダウンロードするフローデータ
 * @param filename ファイル名
 */
export async function downloadFlow(flowData: Flow, filename: string): Promise<void> {
  const json = JSON.stringify(flowData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * ダウンロードするファイル名を取得する
 * @param flowData フローデータ
 * @returns ファイル名
 */
export function getDownloadFilename(flowData: Flow): string {
  return `${flowData.title || 'flow'}.json`;
}

/**
 * 変更を破棄するかどうかの確認
 * @param isEditMode 編集モードかどうか
 * @param t 翻訳関数
 * @returns 確認結果
 */
export function shouldConfirmDiscard(isEditMode: boolean, t: (_key: string) => string): boolean {
  if (!isEditMode) return true;
  return window.confirm(t('confirmDiscardChanges'));
}

/**
 * データがないことを通知する
 * @param t 翻訳関数
 */
export function showNoDataAlert(t: (_key: string) => string): void {
  alert(t('noDataToDownload'));
}

// flowOperations.tsから移行した関数
/**
 * フローデータを保存する
 * @param flowData 保存するフローデータ
 * @param sourceId ソースID（オプション）
 * @returns 保存が成功したかどうか
 */
export const saveFlow = async (flowData: Flow, sourceId: string | null = null): Promise<boolean> => {
  try {
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flowData.title || 'flow'}.json`;
    a.setAttribute('aria-label', `${flowData.title}をダウンロード`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const currentPath = sourceId ? `/${sourceId}` : '/';
    history.replaceState({ flowData, isSaving: true }, '', currentPath);
    announceToScreenReader('フローを保存しました');
    return true;
  } catch (error) {
    handleError(error, '保存中');
    return false;
  }
};

