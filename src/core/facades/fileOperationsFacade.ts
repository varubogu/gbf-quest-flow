import {
  loadFlowFromFile as loadFlowFromFile_Service,
  saveFlowToFile as saveFlowToFile_Service,
} from '@/core/services/fileService';

export async function loadFlowFromFile(): Promise<void> {
  await loadFlowFromFile_Service();
}

export async function saveFlowToFile(fileName?: string): Promise<void> {
  await saveFlowToFile_Service(fileName);
}