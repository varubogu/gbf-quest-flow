import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useActionCellError = () => {
  const { t } = useTranslation();

  const handlePasteError = useCallback(
    (error: unknown) => {
      if (error instanceof Error) {
        const message = error.message.startsWith('too') || error.message.startsWith('no')
          ? t(error.message)
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
        ? t(message)
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