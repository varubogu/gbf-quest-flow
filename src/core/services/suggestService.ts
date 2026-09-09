import type { SuggestItem } from '@/types/suggest';
import { jobNames, jobAbilities, normalAbilities } from '@/config/jobs';
import { questNames } from '@/config/quests';
import { characterAwakeTypeSuggest, chargeAttackSelect, guardSelect } from '@/config/suggest';
import jobsCatalog from '@/lib/i18n/locales/ja/jobs.json';
import skillEffectSettings from '@/content/settings/skillEffects.json';

const HISTORY_STORAGE_KEY = 'gbf-suggest-history';
const HISTORY_LIMIT = 20;

export type SuggestHistoryKind = 'character' | 'weapon' | 'summon' | 'equipment';

interface SuggestHistory {
  character: string[];
  weapon: string[];
  summon: string[];
  equipment: string[];
}

type Translate = (_key: string, _options?: Record<string, unknown>) => string;

/**
 * 入力文字列で候補を絞り込む。空文字なら先頭から返す。
 */
export function filterSuggestItems(items: SuggestItem[], query: string, max = 8): SuggestItem[] {
  const normalized = query.trim().toLowerCase();
  const matched = normalized
    ? items.filter(
        (item) =>
          item.label.toLowerCase().includes(normalized) ||
          item.id.toLowerCase().includes(normalized)
      )
    : items;
  return matched.slice(0, max);
}

function toItems(entries: Array<{ id: string; label: string }>): SuggestItem[] {
  return entries.filter((item) => item.label);
}

export function getLiteralSuggestItems(values: string[], query: string): SuggestItem[] {
  return filterSuggestItems(
    values.map((value) => ({ id: value, label: value })),
    query
  );
}

export function getJobSuggestItems(t: Translate, query: string): SuggestItem[] {
  const keys = Array.from(new Set([...Object.keys(jobsCatalog), ...jobNames]));
  return filterSuggestItems(
    toItems(
      keys.map((key) => ({
        id: key,
        label: t(key, { defaultValue: key }),
      }))
    ),
    query
  );
}

export function getAbilitySuggestItems(
  t: Translate,
  query: string,
  jobKey?: string
): SuggestItem[] {
  const normalItems = normalAbilities.map((key) => ({
    id: `normal.${key}`,
    label: t(`normal.${key}`, { defaultValue: key }),
  }));
  const jobItems = jobAbilities
    .filter((ability) => !jobKey || ability.jobs.includes(jobKey) || ability.jobs.length === 0)
    .map((ability) => ({
      id: ability.name,
      label: t(ability.name.replace(/^job\./, 'job.'), {
        defaultValue: ability.name,
      }),
    }));
  return filterSuggestItems(toItems([...jobItems, ...normalItems]), query, 12);
}

export function getAwakeSuggestItems(t: Translate, query: string): SuggestItem[] {
  return filterSuggestItems(
    characterAwakeTypeSuggest.map((item) => ({
      id: String(item.id),
      label: t(item.translationKey, { defaultValue: item.translationKey }),
    })),
    query
  );
}

export function getQuestSuggestItems(t: Translate, query: string): SuggestItem[] {
  const items: SuggestItem[] = [];
  for (const quest of questNames) {
    items.push({
      id: quest.name,
      label: t(quest.name, { defaultValue: quest.name }),
    });
    for (const alias of quest.alias) {
      items.push({
        id: alias,
        label: t(alias, { defaultValue: alias }),
      });
    }
  }
  return filterSuggestItems(items, query);
}

export function getSkillFieldSuggestItems(t: Translate, query: string): SuggestItem[] {
  return filterSuggestItems(
    skillEffectSettings.fields.map((field) => ({
      id: field.key,
      label: t(`skill_${field.key}`, { defaultValue: field.key }),
    })),
    query,
    12
  );
}

export function getChargeSuggestItems(query: string): SuggestItem[] {
  return getLiteralSuggestItems(chargeAttackSelect, query);
}

export function getGuardSuggestItems(query: string): SuggestItem[] {
  return getLiteralSuggestItems(guardSelect, query);
}

function emptyHistory(): SuggestHistory {
  return { character: [], weapon: [], summon: [], equipment: [] };
}

function readHistory(): SuggestHistory {
  if (typeof window === 'undefined') {
    return emptyHistory();
  }
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return emptyHistory();
    const parsed = JSON.parse(raw) as Partial<SuggestHistory>;
    return { ...emptyHistory(), ...parsed };
  } catch {
    return emptyHistory();
  }
}

function writeHistory(history: SuggestHistory): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
}

export function rememberSuggestValue(kind: SuggestHistoryKind, value: string): void {
  const trimmed = value.trim();
  if (!trimmed) return;
  const history = readHistory();
  const next = [trimmed, ...history[kind].filter((item) => item !== trimmed)].slice(
    0,
    HISTORY_LIMIT
  );
  history[kind] = next;
  writeHistory(history);
}

export function getHistorySuggestItems(kind: SuggestHistoryKind, query: string): SuggestItem[] {
  return getLiteralSuggestItems(readHistory()[kind], query);
}

export function getNameSuggestItems(
  kind: SuggestHistoryKind,
  query: string,
  extra: string[] = []
): SuggestItem[] {
  const extras = extra.filter(Boolean).map((name) => ({ id: name, label: name }));
  const history = getHistorySuggestItems(kind, '');
  const merged = [
    ...history,
    ...extras.filter((item) => !history.some((h) => h.label === item.label)),
  ];
  return filterSuggestItems(merged, query);
}
