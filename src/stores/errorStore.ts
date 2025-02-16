import { create } from 'zustand';

interface ErrorState {
  error: Error | null;
  isErrorDialogOpen: boolean;
  setError: (error: Error | null) => void;
  setIsErrorDialogOpen: (isOpen: boolean) => void;
  showError: (error: Error) => void;
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
