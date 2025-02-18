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
  setError: (error) => set({ error }),
  setIsErrorDialogOpen: (isOpen) => set({ isErrorDialogOpen: isOpen }),
  showError: (error) => set({ error, isErrorDialogOpen: true }),
  clearError: () => set({ error: null, isErrorDialogOpen: false }),
}));

export default useErrorStore;
