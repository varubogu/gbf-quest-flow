// ステップ5：編集モード機能を移行しました
// ステップ7：ファイル操作機能を移行しました
// ステップ11：履歴管理機能との連携を改善しました
// ステップ13：flowStoreFacadeへの移行を完了しました

// 以前のインポート
// import useFlowStore from './flowStore';
import useFlowStore from '../facades/flowStoreFacade';
import useErrorStore from './errorStore';
import useHistoryStore from './historyStore';
import useBaseFlowStore from './baseFlowStore';
import useEditModeStore from './editModeStore';
import useCursorStore from './cursorStore';
// @deprecated src/facades/flowStoreFacadeを直接使用しています。
import useFlowStoreFacade from '@/core/facades/flowStoreFacade';
import useSettingsStore from './settingsStore';


export {
  useFlowStore,
  useErrorStore,
  useHistoryStore,
  useBaseFlowStore,
  useEditModeStore,  // 新規追加
  useCursorStore, // 新規追加
  useFlowStoreFacade,
  useSettingsStore,

};