import { StorageQuotaLimited } from './error'

export interface IStorage {
  get(k: string): string | null
  del(k: string): void
  set(k: string, v: string, timeout?: number): void
  flush(): void
}

export default class LocalStorage implements IStorage {
  storage = (global as any).localStorage

  get(k: string) {
    const val = this.storage.getItem(k)
    if (!val) return null

    const { v, e } = JSON.parse(val)
    const now = Date.now()
    if (e > 0 && e < now) {
      this.del(k)
      return null
    }

    return v
  }

  del(k: string) {
    this.storage.removeItem(k)
  }

  set(k: string, v: string, timeout?: number) {
    try {
      this.storage.setItem(k, JSON.stringify({
        v: v,
        // expiredAt
        e: timeout ? Date.now() + timeout : -1
      }))
    } catch (err) {
      switch (err.name) {
        case 'QuotaExceededError':
        case 'NS_ERROR_DOM_QUOTA_REACHED':
          throw new StorageQuotaLimited()
        default:
          throw err
      }
    }
  }

  flush() {
    this.storage.clear()
  }
}
