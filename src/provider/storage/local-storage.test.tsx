import { LocalStorage } from './local-storage';
import { generateRandomString } from './memory-storage.test';

describe('Local storage provider', () => {
  it('should not crash', async () => {
    const rnd = generateRandomString(64);
    const val = (Math.random() * 1000).toString();
    const prov = new LocalStorage();
    expect(prov.getItem(rnd)).toBe(null);
    prov.setItem(rnd, val);
    expect(prov.getItem(rnd)).toBe(val);
  });
});
