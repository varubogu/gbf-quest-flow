import type { Flow } from '@/types/models';
import useBaseFlowStore from '@/core/stores/baseFlowStore';
import useErrorStore from '@/core/stores/errorStore';

/**
 * JSONファイルからフローデータを読み込む
 */
export async function loadFlowFromFile(): Promise<void> {
  try {
    const input = newFileElement();

    const filePromise = new Promise<File | null>((resolve) => {
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
    const file = await filePromise;

    if (!file) {
      return;
    }

    const data = await parseData(file);
    useBaseFlowStore.getState().setFlowData(data);
  } catch (error) {
    useErrorStore
      .getState()
      .showError(
        error instanceof Error ? error : new Error('ファイルの読み込み中にエラーが発生しました')
      );
    throw error;
  }
};

/**
 * 現在のフローデータをJSONファイルとして保存
 * @param fileName - 保存するファイル名（省略時はフロータイトルを使用）
 */
export async function saveFlowToFile(fileName?: string): Promise<void> {
  try {
    const currentData = useBaseFlowStore.getState().getFlowData();
    if (!currentData) {
      throw new Error('保存するデータがありません');
    }

    // JSONデータを生成
    const jsonData = JSON.stringify(currentData, null, 2);

    // Blobを作成
    const blob = new Blob([jsonData], { type: 'application/json' });

    // ダウンロードリンクを作成
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // ファイル名を設定（指定がない場合はフローのタイトルを使用）
    const defaultFileName = `${currentData.title || 'flow'}.json`;
    link.download = fileName || defaultFileName;

    // リンクをクリックしてダウンロードを開始
    document.body.appendChild(link);
    link.click();

    // クリーンアップ
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    useErrorStore
      .getState()
      .showError(
        error instanceof Error ? error : new Error('ファイルの保存中にエラーが発生しました')
      );
    throw error;
  }
};

async function parseData(file: File): Promise<Flow> {
  const text = await file.text();
  const data = JSON.parse(text) as Flow;
  return data;
}

function newFileElement(): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  return input;
}

function fileOnChange(resolve: (_value: File | null) => void): (_e: Event) => void {
  return (e: Event): void => {
    const file = (e.target as HTMLInputElement).files?.[0];
    resolve(file || null);
  };
}

function onFocus(input: HTMLInputElement, resolve: (_value: File | null) => void): void {
  setTimeout(() => {
    if (!input.files?.length) {
      resolve(null);
    }
  }, 300);
}

