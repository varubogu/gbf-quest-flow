import { create } from 'zustand';
import type { AppError } from '@/types/error.types';
import { logError } from '@/core/services/errorService';

interface ErrorState {
  error: AppError | null;
  isErrorDialogOpen: boolean;
  setError: (_error: AppError | null) => void;
  setIsErrorDialogOpen: (_isOpen: boolean) => void;
  showError: (_error: AppError) => void;
  clearError: () => void;
  executeRecoveryAction: () => Promise<void>;
}

const useErrorStore = create<ErrorState>((set, get) => ({
  error: null,
  isErrorDialogOpen: false,

  setError: (error: AppError | null): void => {
    if (error) {
      logError(error);
    }
    set({ error });
  },

  setIsErrorDialogOpen: (isOpen: boolean): void =>
    set({ isErrorDialogOpen: isOpen }),

  showError: (error: AppError): void => {
    logError(error);
    set({ error, isErrorDialogOpen: true });
  },

  clearError: (): void =>
    set({ error: null, isErrorDialogOpen: false }),

  executeRecoveryAction: async (): Promise<void> => {
    const { error } = get();
    if (error?.recoverable && error.recoveryAction) {
      try {
        await error.recoveryAction();
        set({ error: null, isErrorDialogOpen: false });
      } catch (recoveryError) {
        // リカバリーアクション実行中にエラーが発生した場合
        if (recoveryError instanceof Error) {
          console.error('リカバリーアクション実行中にエラーが発生しました:', recoveryError);
        }
      }
    }
  },
}));

export default useErrorStore;
