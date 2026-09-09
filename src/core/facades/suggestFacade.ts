import type { SuggestItem } from '@/types/suggest';
import {
  getAbilitySuggestItems,
  getAwakeSuggestItems,
  getChargeSuggestItems,
  getGuardSuggestItems,
  getHistorySuggestItems,
  getJobSuggestItems,
  getNameSuggestItems,
  getQuestSuggestItems,
  getSkillFieldSuggestItems,
  rememberSuggestValue,
  type SuggestHistoryKind,
} from '@/core/services/suggestService';

type Translate = (_key: string, _options?: Record<string, unknown>) => string;

export function suggestJobs(t: Translate, query: string): SuggestItem[] {
  return getJobSuggestItems(t, query);
}

export function suggestAbilities(t: Translate, query: string, jobKey?: string): SuggestItem[] {
  return getAbilitySuggestItems(t, query, jobKey);
}

export function suggestAwakeTypes(t: Translate, query: string): SuggestItem[] {
  return getAwakeSuggestItems(t, query);
}

export function suggestQuests(t: Translate, query: string): SuggestItem[] {
  return getQuestSuggestItems(t, query);
}

export function suggestSkillFields(t: Translate, query: string): SuggestItem[] {
  return getSkillFieldSuggestItems(t, query);
}

export function suggestCharge(query: string): SuggestItem[] {
  return getChargeSuggestItems(query);
}

export function suggestGuard(query: string): SuggestItem[] {
  return getGuardSuggestItems(query);
}

export function suggestNames(
  kind: SuggestHistoryKind,
  query: string,
  extra: string[] = []
): SuggestItem[] {
  return getNameSuggestItems(kind, query, extra);
}

export function suggestHistory(kind: SuggestHistoryKind, query: string): SuggestItem[] {
  return getHistorySuggestItems(kind, query);
}

export function rememberName(kind: SuggestHistoryKind, value: string): void {
  rememberSuggestValue(kind, value);
}
