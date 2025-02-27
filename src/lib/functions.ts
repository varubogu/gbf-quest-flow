import useFlowStore from '@/core/stores/flowStore';
import type { Flow } from '@/types/models';

export function setTitle(title: string): void {
  const titleBase = 'グラブル行動表';
  let newTitle;
  if (title) {
    newTitle = `${titleBase} - ${title}`;
  } else {
    newTitle = titleBase;
  }
  document.title = newTitle;
}

export async function loadSlugData(slug: string): Promise<void> {
  const res: Response = await fetch(`/content/flows/${slug}.json`);
  const data = await res.json() as Flow;

  useFlowStore.getState().setFlowData(data);
}
