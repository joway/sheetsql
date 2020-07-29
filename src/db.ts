import { Query, Document } from './types'
import GoogleStorage, { IStorageOptions, IStorage } from './storage'

export interface IDatabaseOptions extends IStorageOptions {}

export default class Database {
  private storage: IStorage

  constructor(opts: IDatabaseOptions) {
    this.storage = new GoogleStorage(opts)
  }

  async load() {
    return this.storage.load()
  }

  async insert(docs: Document[]): Promise<Document[]> {
    return this.storage.insert(docs)
  }

  async find(query?: Query): Promise<Document[]> {
    return this.storage.find(query)
  }

  async findOne(query?: Query): Promise<Document | null> {
    const docs = await this.storage.find(query)
    return docs.length ? docs[0] : null
  }

  async update(query: Query, toUpdate: Document): Promise<Document[]> {
    return this.storage.update(query, toUpdate)
  }

  async updateOne(query: Query, toUpdate: Partial<Document>): Promise<Document | null> {
    const newDocs = await this.storage.update(query, toUpdate, { updatedOnce: true })
    return newDocs.length ? newDocs[0] : null
  }

  async remove(query: Query): Promise<Document[]> {
    return this.storage.remove(query)
  }

  async removeOne(query: Query): Promise<Document | null> {
    const removedDocs = await this.storage.remove(query)
    return removedDocs.length ? removedDocs[0] : null
  }
}
