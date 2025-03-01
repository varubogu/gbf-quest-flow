import organizationSettings from '@/content/settings/organization.json';
import type { Flow } from '@/types/models';
import useBaseFlowStore from '@/core/stores/baseFlowStore';
import useErrorStore from '@/core/stores/errorStore';
import useEditModeStore from '../stores/editModeStore';
import useCursorStore from '../stores/cursorStore';
import { clearHistory } from './historyService';

/**
 * ファイル操作関連のサービス
 *
 * このサービスは、ファイルの読み込みや保存に関する機能を提供します。
 */

// エラーハンドリング関数を直接実装
function handleError(error: unknown, defaultMessage: string): void {
  useErrorStore
    .getState()
    .showError(
      error instanceof Error ? error : new Error(defaultMessage)
    );
}

export async function newFlowData(): Promise<void> {
  try {
    // 新しいデータを作成
    const newData = newEmptyData();

    // 履歴をクリア
    clearHistory();

    // カーソル位置をリセット
    useCursorStore.getState().setCurrentRow(0);

    // 編集モードを設定
    useEditModeStore.setState({ isEditMode: true });

    // baseFlowStoreを更新
    useBaseFlowStore.setState({
      flowData: newData,
      originalData: null, // 新規作成時はoriginalDataはnull
    });

    // 更新後の状態を確認
    const updatedState = useBaseFlowStore.getState();
    const editState = useEditModeStore.getState();
    if (!updatedState.flowData || !editState.isEditMode) {
      console.error('createNewFlow: 状態の更新に失敗しました', updatedState);
    }

    console.log('新しいフローデータが作成されました:', newData);
    console.log('baseFlowStoreが更新されました:', useBaseFlowStore.getState().flowData);
  } catch (error) {
    console.error('新規フロー作成エラー:', error);
    handleError(error, '新規フローの作成中にエラーが発生しました');
    throw error;
  }
}

/**
 * JSONファイルからフローデータを読み込む
 */
export async function loadFlowFromFile(): Promise<void> {
  try {
    // ファイル選択ダイアログを表示
    const file = await selectFile();
    if (!file) {
      console.log('ファイル選択がキャンセルされました');
      return;
    }

    // ファイルからJSONを読み込む
    const data = await readJsonFile(file);
    if (!data) {
      throw new Error('ファイルからデータを読み込めませんでした');
    }

    // 履歴をクリア
    clearHistory();

    // カーソル位置をリセット
    useCursorStore.getState().setCurrentRow(0);

    // 編集モードをリセット
    useEditModeStore.setState({ isEditMode: false });

    // baseFlowStoreを更新
    useBaseFlowStore.setState({
      flowData: data,
      originalData: null,
    });

    // 更新後の状態を確認
    const updatedState = useBaseFlowStore.getState();
    if (!updatedState.flowData) {
      console.error('loadFlowFromFile: 状態の更新に失敗しました', updatedState);
    }

    console.log('ファイルからフローデータを読み込みました:', data.title);
    console.log('baseFlowStoreが更新されました:', useBaseFlowStore.getState().flowData);

    // URLを更新
    history.pushState(
      { isSaving: false, flowData: data },
      '',
      `${window.location.pathname}?mode=view`
    );
  } catch (error) {
    console.error('ファイル読み込みエラー:', error);
    handleError(error, 'ファイルの読み込み中にエラーが発生しました');
    throw error;
  }
}

/**
 * 現在のフローデータをJSONファイルとして保存
 * @param fileName - 保存するファイル名（省略時はフロータイトルを使用）
 */
export async function saveFlowToFile(fileName?: string): Promise<void> {
  try {
    // まずbaseFlowStoreからデータを取得
    let currentData = useBaseFlowStore.getState().getFlowData();


    if (!currentData) {
      throw new Error('保存するデータがありません');
    }

    console.log('保存するデータ:', currentData);

    // ファイル保存処理
    await saveJsonToFile(currentData, fileName);
  } catch (error) {
    handleError(error, 'ファイルの保存中にエラーが発生しました');
    throw error;
  }
};

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

function newEmptyData(): Flow {
  // 空のデータを作成
  return {
    title: '新しいフロー',
    quest: '',
    author: '',
    description: '',
    updateDate: new Date().toISOString(),
    note: '',
    organization: {
      job: {
        name: '',
        note: '',
        equipment: {
          name: '',
          note: '',
        },
        abilities: Array(organizationSettings.job.abilities)
          .fill(null)
          .map(() => ({ name: '', note: '' })),
      },
      member: {
        front: Array(organizationSettings.member.front)
          .fill(null)
          .map(() => ({
            name: '',
            note: '',
            awaketype: '',
            accessories: '',
            limitBonus: '',
          })),
        back: Array(organizationSettings.member.back)
          .fill(null)
          .map(() => ({
            name: '',
            note: '',
            awaketype: '',
            accessories: '',
            limitBonus: '',
          })),
      },
      weapon: {
        main: {
          name: '',
          note: '',
          additionalSkill: '',
        },
        other: Array(organizationSettings.weapon.other)
          .fill(null)
          .map(() => ({
            name: '',
            note: '',
            additionalSkill: '',
          })),
        additional: Array(organizationSettings.weapon.additional)
          .fill(null)
          .map(() => ({
            name: '',
            note: '',
            additionalSkill: '',
          })),
      },
      weaponEffects: {
        taRate: '',
        hp: '',
        defense: '',
      },
      summon: {
        main: { name: '', note: '' },
        friend: { name: '', note: '' },
        other: Array(organizationSettings.summon.other)
          .fill(null)
          .map(() => ({ name: '', note: '' })),
        sub: Array(organizationSettings.summon.sub)
          .fill(null)
          .map(() => ({ name: '', note: '' })),
      },
      totalEffects: {
        taRate: '',
        hp: '',
        defense: '',
      },
    },
    always: '',
    flow: [
      {
        hp: '',
        prediction: '',
        charge: '',
        guard: '',
        action: '',
        note: '',
      },
    ],
  };
}