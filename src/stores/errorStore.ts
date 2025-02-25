import { create } from 'zustand';

interface ErrorState {
  error: Error | null;
  isErrorDialogOpen: boolean;
  setError: (_error: Error | null) => void;
  setIsErrorDialogOpen: (_isOpen: boolean) => void;
  showError: (_error: Error) => void;
  clearError: () => void;
}

const useErrorStore = create<ErrorState>((set) => ({
  error: null,
  isErrorDialogOpen: false,
  setError: (error: Error | null): void => set({ error }),
  setIsErrorDialogOpen: (isOpen: boolean): void => set({ isErrorDialogOpen: isOpen }),
  showError: (error: Error): void => set({ error, isErrorDialogOpen: true }),
  clearError: (): void => set({ error: null, isErrorDialogOpen: false }),
}));

export default useErrorStore;
