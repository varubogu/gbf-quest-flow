import type { Flow } from '@/types/models';
import {
  downloadFlow as downloadFlow_Service,
  getDownloadFilename as getDownloadFilename_Service,
  shouldConfirmDiscard as shouldConfirmDiscard_Service,
  showNoDataAlert as showNoDataAlert_Service,
  saveFlow as saveFlow_Service,
  updateNewFlowState as updateNewFlowState_Service
} from '@/core/services/fileOperationService';

// fileService.tsからの関数をインポート
import { loadFlowFromFile as loadFlowFromFile_Service, saveFlowToFile as saveFlowToFile_Service } from '@/core/services/fileService';

/**
 * フローデータをダウンロードする
 * @param flowData ダウンロードするフローデータ
 * @param filename ファイル名
 */
export async function downloadFlow(flowData: Flow, filename: string): Promise<void> {
  await downloadFlow_Service(flowData, filename);
}

/**
 * ダウンロードするファイル名を取得する
 * @param flowData フローデータ
 * @returns ファイル名
 */
export function getDownloadFilename(flowData: Flow): string {
  return getDownloadFilename_Service(flowData);
}

/**
 * 変更を破棄するかどうかの確認
 * @param isEditMode 編集モードかどうか
 * @param t 翻訳関数
 * @returns 確認結果
 */
export function shouldConfirmDiscard(isEditMode: boolean, t: (_key: string) => string): boolean {
  return shouldConfirmDiscard_Service(isEditMode, t);
}

/**
 * データがないことを通知する
 * @param t 翻訳関数
 */
export function showNoDataAlert(t: (_key: string) => string): void {
  showNoDataAlert_Service(t);
}

/**
 * JSONファイルからフローデータを読み込む
 */
export async function loadFlowFromFile(): Promise<void> {
  await loadFlowFromFile_Service();
}

/**
 * 現在のフローデータをJSONファイルとして保存
 * @param fileName - 保存するファイル名（省略時はフロータイトルを使用）
 */
export async function saveFlowToFile(fileName?: string): Promise<void> {
  await saveFlowToFile_Service(fileName);
}

/**
 * フローデータを保存する（flowOperations.tsからの移行）
 * @param flowData 保存するフローデータ
 * @param sourceId ソースID（オプション）
 * @returns 保存が成功したかどうか
 */
export async function saveFlow(flowData: Flow, sourceId: string | null = null): Promise<boolean> {
  return await saveFlow_Service(flowData, sourceId);
}

/**
 * 新規作成時のURL状態とアクセシビリティを更新する（flowOperations.tsからの移行）
 * @param flowData 現在のフローデータ（履歴用）
 */
export function updateNewFlowState(flowData: Flow | null = null): void {
  updateNewFlowState_Service(flowData);
}