import { LocalStorage } from './local-storage';

export class MemoryStorage implements LocalStorage {
  private data: { [key: string]: string } = {};

  setItem(key: string, value: string): void {
    this.data[key] = value;
  }

  getItem(key: string): string | null {
    return this.data[key] || null;
  }
}
