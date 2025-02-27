import organizationSettings from '@/content/settings/organization.json';
import type { Flow } from '@/types/models';
import useBaseFlowStore from '@/core/stores/baseFlowStore';
import useErrorStore from '@/core/stores/errorStore';
import useHistoryStore from '../stores/historyStore';
import useEditModeStore from '../stores/editModeStore';

export async function newFlowData(): Promise<void> {
  // 空のデータを作成
  const newData: Flow = newEmptyData();

  // 現在の状態を取得
  const dataState = useBaseFlowStore.getState();
  useBaseFlowStore.setState({
    flowData: newData,
    originalData: dataState.flowData || null, // 現在のデータをoriginalDataとして保持
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

  // baseFlowStoreも同期
  useBaseFlowStore.getState().setFlowData(newData);
}

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