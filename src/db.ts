export interface Document extends Object {}
export interface Query extends Object {}

export interface IDatabase {
  insert(doc: Document): Promise<Document>
  find(query?: Query): Promise<Document[]>
  findOne(query?: Query): Promise<Document | null>
  update(query: Query, toUpdate: Partial<Document>): Promise<Document[]>
  updateOne(query: Query, toUpdate: Partial<Document>): Promise<Document>
  remove(query: Query): Promise<Document[]>
  removeOne(query: Query): Promise<Document>
}

export default class Database implements IDatabase {
  private db: string | null = null

  constructor(db: string) {
    this.db = db
  }

  async insert(doc: Document): Promise<Document> {}

  async find(query?: Query): Promise<Document[]> {}

  async findOne(query?: Query): Promise<Document | null> {}
  async update(query: Query, toUpdate: Partial<Document>): Promise<Document[]> {}
  async updateOne(query: Query, toUpdate: Partial<Document>): Promise<Document> {}
  async remove(query: Query): Promise<Document[]> {}
  async removeOne(query: Query): Promise<Document> {}
}
