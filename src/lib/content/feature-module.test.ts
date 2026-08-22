import { describe, expect, it } from 'vitest';
import { resolveFeatureModule } from './feature-module';

const shared = {
  eyebrow: 'Shared eyebrow',
  heading: 'Shared heading',
  intro: 'Shared intro',
  items: [{ heading: 'Shared item', description: 'Shared description' }],
};

const custom = {
  eyebrow: 'Custom eyebrow',
  heading: 'Custom heading',
  intro: '',
  items: [{ heading: 'Custom item', description: 'Custom description' }],
};

describe('landing feature module inheritance', () => {
  it('uses the homepage feature module by default', () => {
    expect(resolveFeatureModule(shared, undefined, undefined)).toEqual(shared);
    expect(resolveFeatureModule(shared, custom, 'shared')).toEqual(shared);
  });

  it('uses a landing-page override and inherits blank module copy from the homepage', () => {
    expect(resolveFeatureModule(shared, custom, 'custom')).toEqual({
      eyebrow: 'Custom eyebrow',
      heading: 'Custom heading',
      intro: 'Shared intro',
      items: custom.items,
    });
  });

  it('preserves existing landing-page overrides that predate the source selector', () => {
    expect(resolveFeatureModule(shared, custom, undefined).items).toEqual(custom.items);
  });

  it('falls back safely when custom mode has no custom module', () => {
    expect(resolveFeatureModule(shared, undefined, 'custom')).toEqual(shared);
  });
});
