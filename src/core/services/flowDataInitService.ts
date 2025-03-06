import organizationSettings from '@/content/settings/organization.json';
import type { Flow } from '@/types/models';
import useFlowStore from '@/core/stores/flowStore';
import useEditModeStore from '../stores/editModeStore';
import useCursorStore from '../stores/cursorStore';
import { clearHistory } from './historyService';
import { handleFileOperationError } from './fileOperationService';

/**
 * フローデータの初期化関連のサービス
 *
 * このサービスは、新規データ作成などの初期化処理を提供します。
 */

/**
 * 新しい空のフローデータを作成する
 */
export async function newFlowData(): Promise<void> {
  try {
    // 新しいデータを作成
    const newData = createEmptyFlowData();

    // 履歴をクリア
    clearHistory();

    // カーソル位置をリセット
    useCursorStore.getState().setCurrentRow(0);

    // 編集モードを設定
    useEditModeStore.setState({ isEditMode: true });

    // flowStoreを更新
    useFlowStore.setState({
      flowData: newData,
      originalData: null, // 新規作成時はoriginalDataはnull
    });

    // 更新後の状態を確認
    const updatedState = useFlowStore.getState();
    const editState = useEditModeStore.getState();
    if (!updatedState.flowData || !editState.isEditMode) {
      console.error('createNewFlow: 状態の更新に失敗しました', updatedState);
    }

  } catch (error) {
    console.error('新規フロー作成エラー:', error);
    handleFileOperationError(error, '新規フローの作成中にエラーが発生しました');
    throw error;
  }
}

/**
 * 空のフローデータを作成する
 */
export function createEmptyFlowData(): Flow {
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