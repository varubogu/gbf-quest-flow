import useFlowStore from '@/stores/flowStore';
import type { Flow } from '@/types/models';

export function setTitle(title: string) {
  const titleBase = 'グラブル行動表';
  let newTitle;
  if (title) {
    newTitle = `${titleBase} - ${title}`;
  } else {
    newTitle = titleBase;
  }
  document.title = newTitle;
}

export async function loadSlugData(slug: string) {
  const res: Response = await fetch(`/content/flows/${slug}.json`);
  const data = await res.json() as Flow;

  useFlowStore.getState().setFlowData(data);
}
