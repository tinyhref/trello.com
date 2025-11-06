/**
 * Implements the Web Storage API interface, but stores values in a simple
 * object instead of persisting to browser storage.
 * Used to deal with cases where the browser prevents access to the Storage API
 */
export class InMemoryStorage implements Storage {
  private storage: Record<string, string>;

  constructor() {
    this.storage = {};
  }

  get length() {
    return Object.keys(this.storage).length;
  }

  clear() {
    this.storage = {};
  }

  getItem(key: string): string | null {
    return this.storage[key] || null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.storage);
    return keys[index] || null;
  }

  removeItem(key: string): void {
    delete this.storage[key];
  }

  setItem(key: string, value: string): void {
    this.storage[key] = value || '';
  }
}
