import type { Flow } from '@/types/models';

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

export function getDownloadFilename(flowData: Flow): string {
  return `${flowData.title || 'flow'}.json`;
}

export function shouldConfirmDiscard(isEditMode: boolean, t: (_key: string) => string): boolean {
  if (!isEditMode) return true;
  return window.confirm(t('confirmDiscardChanges'));
}

export function showNoDataAlert(t: (_key: string) => string): void {
  alert(t('noDataToDownload'));
}