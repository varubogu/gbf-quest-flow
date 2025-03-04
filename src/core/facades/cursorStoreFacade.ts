import { setCurrentRow as setCurrentRowService } from '@/core/services/cursorService';

export function setCurrentRow(row: number): void {
  setCurrentRowService(row);
}
