import { MemoryStorage } from './memory-storage';

export function generateRandomString(length: number): string {
  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(randomValues[i] % charactersLength);
  }
  return result;
}

describe('Memory storage provider', () => {
  it('should not crash', async () => {
    const rnd = generateRandomString(64);
    const val = (Math.random() * 1000).toString();
    const prov = new MemoryStorage();
    expect(prov.getItem(rnd)).toBe(null);
    prov.setItem(rnd, val);
    expect(prov.getItem(rnd)).toBe(val);
  });
});
