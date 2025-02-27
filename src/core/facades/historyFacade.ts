import type { Flow, HistoryState } from '@/types/models';
import {
    pushToHistory as pushToHistory_Service,
    undo as undo_Service,
    redo as redo_Service,
    clearHistory as clearHistory_Service,
    getHistoryState as getHistoryState_Service,
} from '@/core/services/historyService';


export const pushToHistory = (data: Flow): void => {
  pushToHistory_Service(data);
};

export const undo = (): void => {
  undo_Service();
};

export const redo = (): void => {
  redo_Service();
};

export const clearHistory = (): void => {
  clearHistory_Service();
};

export const getHistoryState = (): HistoryState => {
  return getHistoryState_Service();
};

