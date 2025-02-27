// ステップ5：編集モード機能を移行しました
// ステップ7：ファイル操作機能を移行しました
// ステップ11：履歴管理機能との連携を改善しました
// import useFlowStore from './flowStoreFacade'; // 将来的にはこちらに切り替える予定
import useFlowStore from './flowStore';
import useErrorStore from './errorStore';
import useHistoryStore from './historyStore';
import useHistoryFacade from './historyFacade';
import useBaseFlowStore from './baseFlowStore';
import useEditModeStore from './editModeStore';
import useFileOperationStore from './fileOperationStore';
import useFlowStoreFacade from './flowStoreFacade';
import useSettingsStore from './settingsStore';

export {
  useFlowStore,
  useErrorStore,
  useHistoryStore,
  useHistoryFacade,
  useBaseFlowStore,
  useEditModeStore,  // 新規追加
  useFileOperationStore, // 新規追加
  useFlowStoreFacade,
  useSettingsStore,
};