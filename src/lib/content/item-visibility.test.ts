import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { visibleItems } from './item-visibility';

describe('CMS item visibility', () => {
  it('keeps legacy and enabled items while omitting disabled items', () => {
    const items = [{ id: 'legacy' }, { id: 'shown', enabled: true }, { id: 'hidden', enabled: false }];

    expect(visibleItems(items).map(({ id }) => id)).toEqual(['legacy', 'shown']);
  });

  it('can omit incomplete enabled editorial items without rejecting the document', () => {
    const items = [
      { enabled: true, question: '', answer: 'Incomplete' },
      { enabled: true, question: 'Complete?', answer: 'Yes.' },
    ];

    expect(visibleItems(items, (item) => Boolean(item.question && item.answer))).toEqual([items[1]]);
  });

  it('filters homepage cards and landing-page feature and FAQ rendering', () => {
    const homepageSource = readFileSync(new URL('../../pages/index.astro', import.meta.url), 'utf8');
    const landingSource = readFileSync(new URL('../../components/LandingPage.astro', import.meta.url), 'utf8');

    expect(homepageSource).toContain('visibleItems(home.useCases');
    expect(homepageSource).toContain('visibleItems(home.workflows.items');
    expect(homepageSource).not.toContain('isCompleteFeature');
    expect(homepageSource).not.toContain('isCompleteFaq');
    expect(landingSource).toContain('visibleItems(');
    expect(landingSource).toContain('isCompleteFeature');
    expect(landingSource).toContain('isCompleteFaq');
    expect(landingSource).toContain('visibleFaqItems.length > 0');
    expect(landingSource).toContain('mainEntity: visibleFaqItems.map');
    expect(landingSource).not.toContain('resolveFeatureModule(');
    expect(landingSource).not.toContain("getCollection('homepage')");
  });
});
