import { describe, expect, it } from 'vitest';
import { publicNameFromSlug, publicNamePatternsFromSlug, toPublicNameSlug } from './publicRouting';

describe('public name slugs', () => {
  it('creates a readable slug without URL escape sequences', () => {
    const slug = toPublicNameSlug('DYEA & HUSYAM');

    expect(slug).toBe('DYEA-and-HUSYAM');
    expect(slug).not.toMatch(/%20|%26/i);
    expect(publicNameFromSlug(slug)).toBe('DYEA & HUSYAM');
  });

  it('supports punctuation in names and distinguishes ampersands from the word and', () => {
    const slug = toPublicNameSlug('DYEA & HUSYAM (Gold)');

    expect(slug).toBe('DYEA-and-HUSYAM-Gold');
    expect(publicNamePatternsFromSlug(slug)).toEqual([
      'DYEA%&%HUSYAM%Gold',
      'DYEA%and%HUSYAM%Gold',
    ]);
    expect(publicNamePatternsFromSlug('John-and-Mary')).toEqual([
      'John%&%Mary',
      'John%and%Mary',
    ]);
    expect(publicNamePatternsFromSlug('name%wildcard')).toBeNull();
    expect(publicNamePatternsFromSlug('a-and-b-and-c-and-d-and-e-and-f')).toEqual([]);
  });
});