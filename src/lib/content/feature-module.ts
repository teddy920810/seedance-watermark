export type FeatureSource = 'shared' | 'custom';

export interface FeatureModule<TItem> {
  eyebrow: string;
  heading: string;
  intro: string;
  items: TItem[];
}

function inheritedText(custom: string, shared: string): string {
  return custom.trim() || shared;
}

export function resolveFeatureModule<TItem>(
  shared: FeatureModule<TItem>,
  custom: FeatureModule<TItem> | undefined,
  source: FeatureSource | undefined,
): FeatureModule<TItem> {
  const useCustom = source === 'custom' || (source === undefined && custom !== undefined);
  if (!useCustom || !custom) return shared;

  return {
    eyebrow: inheritedText(custom.eyebrow, shared.eyebrow),
    heading: inheritedText(custom.heading, shared.heading),
    intro: inheritedText(custom.intro, shared.intro),
    items: custom.items.length > 0 ? custom.items : shared.items,
  };
}
