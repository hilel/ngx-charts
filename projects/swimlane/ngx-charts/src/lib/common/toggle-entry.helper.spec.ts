import { toggleEntry } from './toggle-entry.helper';

describe('toggleEntry', () => {
  it('adds an entry to hidden entries if not exists', () => {
    const hiddenEntries = [{ name: 'a' } , { name: 'b' }];
    const toggleResult = toggleEntry({ name: 'c' }, hiddenEntries);
    expect(toggleResult.hidden).toBeTrue();
    expect(toggleResult.hiddenEntries).toEqual([{ name: 'a' } , { name: 'b' }, { name: 'c' }]);
  });

  it('remove an entry from hidden entries if exists', () => {
    const hiddenEntries = [{ name: 'a' } , { name: 'b' }];
    const toggleResult = toggleEntry({ name: 'b' }, hiddenEntries);
    expect(toggleResult.hidden).toBeFalse();
    expect(toggleResult.hiddenEntries).toEqual([{ name: 'a' }]);
  });
});
