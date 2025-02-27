import organizationSettings from '@/content/settings/organization.json';
import type { Flow } from '@/types/models';
import useBaseFlowStore from '@/core/stores/baseFlowStore';
import useErrorStore from '@/core/stores/errorStore';
import useHistoryStore from '../stores/historyStore';
import useEditModeStore from '../stores/editModeStore';
import useCursorStore from '../stores/cursorStore';
import useFlowStore from '../stores/flowStore';

// エラーハンドリング関数を直接実装
function handleError(error: unknown, defaultMessage: string): void {
  useErrorStore
    .getState()
    .showError(
      error instanceof Error ? error : new Error(defaultMessage)
    );
}

export async function newFlowData(): Promise<void> {
  // 空のデータを作成
  const newData: Flow = newEmptyData();

  // 現在の状態を取得
  const dataState = useBaseFlowStore.getState();
  useBaseFlowStore.setState({
    flowData: newData,
    originalData: dataState.flowData || null, // 現在のデータをoriginalDataとして保持
  });

  // 旧flowStoreも更新（後方互換性のため）
  const oldDataState = useFlowStore.getState();
  useFlowStore.setState({
    flowData: newData,
    originalData: oldDataState.flowData || null,
    currentRow: 0,
    isEditMode: true
  });

  // historyStoreの履歴をクリア
  useHistoryStore.getState().clearHistory();

  // 編集モードをオンにする
  useEditModeStore.setState({
    isEditMode: true,
  });

  // 更新後の状態を確認
  const updatedState = useBaseFlowStore.getState();
  const editState = useEditModeStore.getState();
  if (!updatedState.flowData || !editState.isEditMode) {
    console.error('createNewFlow: 状態の更新に失敗しました', updatedState);
  }

  console.log('新しいフローデータが作成されました:', newData);
  console.log('baseFlowStoreが更新されました:', useBaseFlowStore.getState().flowData);
  console.log('旧flowStoreも更新されました:', useFlowStore.getState().flowData);
}

/**
 * JSONファイルからフローデータを読み込む
 */
export async function loadFlowFromFile(): Promise<void> {
  try {
    // ファイル選択処理
    const file = await selectFile();
    if (!file) {
      console.log('ファイルが選択されませんでした');
      return;
    }

    console.log('ファイルが選択されました:', file.name);

    // ファイル読み込み処理
    const data = await readJsonFile(file);
    console.log('ファイルからデータを読み込みました:', data);

    // 編集モードをリセット（先に行う）
    useEditModeStore.setState({
      isEditMode: false
    });

    // カーソル位置をリセット
    useCursorStore.setState({
      currentRow: 0
    });

    // 履歴をクリア
    useHistoryStore.getState().clearHistory();

    // baseFlowStoreを更新
    useBaseFlowStore.setState({
      flowData: data,
      originalData: null
    });

    // 旧flowStoreも更新（後方互換性のため）
    useFlowStore.setState({
      flowData: data,
      originalData: null,
      currentRow: 0,
      isEditMode: false
    });

    console.log('ストアが更新されました:', useBaseFlowStore.getState().flowData);
    console.log('旧ストアも更新されました:', useFlowStore.getState().flowData);

    // 強制的に状態変更を通知するため、少し遅延させて再度状態を更新
    setTimeout(() => {
      const currentData = useBaseFlowStore.getState().flowData;
      if (currentData) {
        useBaseFlowStore.setState({ flowData: { ...currentData } });
        useFlowStore.setState({ flowData: { ...currentData } });
        console.log('状態更新を再通知しました');
      }
    }, 100);
  } catch (error) {
    console.error('ファイル読み込みエラー:', error);
    handleError(error, 'ファイルの読み込み中にエラーが発生しました');
    throw error;
  }
};

/**
 * 現在のフローデータをJSONファイルとして保存
 * @param fileName - 保存するファイル名（省略時はフロータイトルを使用）
 */
export async function saveFlowToFile(fileName?: string): Promise<void> {
  try {
    // まずbaseFlowStoreからデータを取得
    let currentData = useBaseFlowStore.getState().getFlowData();

    // baseFlowStoreにデータがない場合は旧flowStoreから取得
    if (!currentData) {
      currentData = useFlowStore.getState().flowData;
      console.log('baseFlowStoreにデータがないため、旧flowStoreからデータを取得しました');
    }

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