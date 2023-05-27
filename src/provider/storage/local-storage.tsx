export class LocalStorage {
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    const data = localStorage.getItem(key);
    return data;
  }
}
