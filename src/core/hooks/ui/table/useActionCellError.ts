import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface UseActionCellErrorResult {
  handlePasteError: (_error: unknown) => void;
  handleValidationError: (_message: string) => void;
}

export const useActionCellError = (): UseActionCellErrorResult => {
  const { t } = useTranslation();

  const handlePasteError = useCallback(
    (error: unknown) => {
      if (error instanceof Error) {
        const message = error.message.startsWith('too') || error.message.startsWith('no')
          ? t(error.message) as string
          : error.message;
        alert(t('pasteError.specific', { message }));
      } else {
        alert(t('pasteError.generic'));
      }
    },
    [t]
  );

  const handleValidationError = useCallback(
    (message: string) => {
      const translatedMessage = message.startsWith('too') || message.startsWith('no')
        ? t(message) as string
        : message;
      alert(t('validationError', { message: translatedMessage }));
    },
    [t]
  );

  return {
    handlePasteError,
    handleValidationError,
  };
};