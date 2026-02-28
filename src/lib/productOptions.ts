import type { Product } from '@/types/site';

export type NormOptionItem = {
  label: string;
  value?: string;
  order?: number;
  default?: boolean;
  price?: number;
};
export type NormOptionGroup = { label: string; optionItems: NormOptionItem[] };

export function normalizeOptionGroups(options: Product['options']): NormOptionGroup[] {
  if (!Array.isArray(options)) return [];
  return options
    .map((g: unknown) => {
      if (!g || typeof g !== 'object') return null;
      const obj = g as Record<string, unknown>;
      const label = String(obj.label ?? '').trim();
      const rawItems = obj.optionItems;
      const optionItems: NormOptionItem[] = Array.isArray(rawItems)
        ? rawItems
            .map((it: unknown, idx: number): NormOptionItem | null => {
              if (!it || typeof it !== 'object') return null;
              const itObj = it as Record<string, unknown>;
              const rawLabel = typeof itObj.label === 'string' ? itObj.label : undefined;
              const rawValue = typeof itObj.value === 'string' ? itObj.value : undefined;
              const itemLabel = String(rawLabel ?? rawValue ?? '').trim();
              if (!itemLabel) return null;
              const order = typeof itObj.order === 'number' && Number.isFinite(itObj.order) ? itObj.order : idx;
              const isDefault = itObj.default === true;
              const price = typeof itObj.price === 'number' && Number.isFinite(itObj.price) ? itObj.price : undefined;
              return { label: itemLabel, value: rawValue, order, default: isDefault || undefined, price };
            })
            .filter((x): x is NormOptionItem => !!x)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : [];
      if (!label || optionItems.length === 0) return null;
      return { label, optionItems };
    })
    .filter((x): x is NormOptionGroup => !!x);
}

export function defaultKeyForGroup(g: NormOptionGroup) {
  const it = g.optionItems.find((x) => x.default) ?? g.optionItems[0];
  return it?.value ?? it?.label ?? '';
}

export function normalizeSelection(
  groups: NormOptionGroup[],
  selectedByGroup: Record<string, string> | undefined
) {
  const next: Record<string, string> = {};
  for (const g of groups) next[g.label] = selectedByGroup?.[g.label] ?? defaultKeyForGroup(g);
  return next;
}

export function effectivePriceForSelection(
  basePrice: number,
  groups: NormOptionGroup[],
  selectedByGroup: Record<string, string> | undefined
) {
  const selection = normalizeSelection(groups, selectedByGroup);
  for (const g of groups) {
    const chosenKey = selection[g.label];
    const chosen =
      g.optionItems.find((it) => (it.value ?? it.label) === chosenKey) ?? g.optionItems[0];
    if (typeof chosen?.price === 'number') return chosen.price;
  }
  return basePrice;
}

export function buildVariantLabel(
  groups: NormOptionGroup[],
  selectedByGroup: Record<string, string> | undefined
) {
  const selection = normalizeSelection(groups, selectedByGroup);
  const parts = groups
    .map((g) => {
      const chosenKey = selection[g.label];
      const chosen =
        g.optionItems.find((it) => (it.value ?? it.label) === chosenKey) ?? g.optionItems[0];
      return chosen ? `${g.label}: ${chosen.label}` : '';
    })
    .filter(Boolean);
  return parts.join(', ');
}

export function buildLineItemId(
  productId: string,
  selectedByGroup: Record<string, string> | undefined
) {
  const selection = selectedByGroup ? selectedByGroup : undefined;
  if (!selection) return productId;
  const bits = Object.entries(selection)
    .filter(([, v]) => !!v)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('|');
  return bits ? `${productId}::${bits}` : productId;
}

