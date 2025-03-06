import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@headlessui/react';
import useFlowStore from '@/core/stores/flowStore';
import useErrorStore from '@/core/stores/errorStore';
import { downloadFlow } from '@/core/facades/FileOperations';
import { formatErrorMessage } from '@/core/services/errorFactoryService';
import type { FlowStore } from '@/types/flowStore.types';

export function ErrorDialog(): React.ReactElement {
  const { t } = useTranslation();
  const flowData = useFlowStore((state: FlowStore) => state.flowData);
  const { error, isErrorDialogOpen, clearError, executeRecoveryAction } = useErrorStore();

  const handleDownload = async (): Promise<void> => {
    if (!flowData) return;

    const filename = `${flowData.title}_backup_${new Date().toISOString()}.json`;
    await downloadFlow(flowData, filename);
  };

  // エラータイプに基づいてアイコンを取得
  const getErrorIcon = (): string => {
    if (!error) return '⚠️';

    switch (error.type) {
      case 'validation':
        return '⚠️';
      case 'network':
        return '🌐';
      case 'file_operation':
        return '📁';
      case 'unknown':
      default:
        return '❌';
    }
  };

  // エラーの重要度に基づいて背景色のクラスを取得
  const getSeverityColorClass = (): string => {
    if (!error) return 'bg-yellow-100';

    switch (error.severity) {
      case 'info':
        return 'bg-blue-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'error':
        return 'bg-red-100';
      case 'critical':
        return 'bg-red-200';
      default:
        return 'bg-gray-100';
    }
  };

  // エラーの重要度に基づいてタイトルの色クラスを取得
  const getSeverityTextColorClass = (): string => {
    if (!error) return 'text-yellow-600';

    switch (error.severity) {
      case 'info':
        return 'text-blue-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      case 'critical':
        return 'text-red-700';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Dialog open={isErrorDialogOpen} onClose={clearError} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className={`mx-auto max-w-md rounded ${getSeverityColorClass()} p-6 shadow-xl`}>
          <Dialog.Title className={`text-lg font-medium ${getSeverityTextColorClass()} mb-4 flex items-center`}>
            <span className="mr-2">{getErrorIcon()}</span>
            {t('errorOccurred')}
          </Dialog.Title>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">{t('errorMessage')}:</p>
            <pre className="bg-white/80 p-3 rounded text-sm overflow-auto max-h-40 border border-gray-200">
              {error ? formatErrorMessage(error) : t('unknownError')}
            </pre>
          </div>

          <div className="flex flex-col gap-3">
            {error?.recoverable && error.recoveryAction && (
              <button
                onClick={() => executeRecoveryAction()}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                {t('recoverFromError')}
              </button>
            )}

            {flowData && (
              <button
                onClick={handleDownload}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                {t('downloadBackup')}
              </button>
            )}

            <button
              onClick={clearError}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              {t('close')}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
