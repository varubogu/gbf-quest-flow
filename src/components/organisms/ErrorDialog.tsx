import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@headlessui/react';
import useFlowStore from '@/stores/flowStore';
import useErrorStore from '@/stores/errorStore';

export const ErrorDialog: React.FC = () => {
  const { t } = useTranslation();
  const { flowData } = useFlowStore();
  const { error, isErrorDialogOpen, clearError } = useErrorStore();

  const handleDownload = () => {
    if (!flowData) return;

    const json = JSON.stringify(flowData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const filename = `${flowData.title}_backup_${new Date().toISOString()}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isErrorDialogOpen} onClose={clearError} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium text-red-600 mb-4">
            {t('errorOccurred')}
          </Dialog.Title>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">{t('errorMessage')}:</p>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-40">
              {error?.message || t('unknownError')}
            </pre>
          </div>

          <div className="flex flex-col gap-3">
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
};
