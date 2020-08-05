import { google, sheets_v4 } from 'googleapis'
import * as _ from 'lodash'
import { Errors } from './errors'
import { Query, Document } from './types'
import * as bluebird from 'bluebird'

export interface IStorage {
  insert(docs: Document[]): Promise<Document[]>
  find(query?: Query): Promise<Document[]>
  update(
    query: Query,
    toUpdate: Partial<Document>,
    opts?: { updatedOnce: boolean },
  ): Promise<Document[]>
  remove(query: Query): Promise<Document[]>
  load(): Promise<void>
}

export interface IStorageOptions {
  db: string // google spreadsheet id
  table?: string

  // google spreadsheet settings
  apiKey?: string
  keyFile?: string

  // storage settings
  cacheTimeoutMs?: number // ms
}

export default class GoogleStorage implements IStorage {
  private sheets: sheets_v4.Sheets
  private db: string
  private table: string
  private schema: string[] = []
  private schemaMetaStore: { [name: string]: { col: number } } = {}
  private data: string[][] = new Array()
  private lastUpdated: Date | null = null
  private cacheTimeoutMs: number

  constructor(opts: IStorageOptions) {
    if (!opts.apiKey && !opts.keyFile) {
      throw new Errors.StorageOptionsError()
    }

    const auth = opts.apiKey
      ? opts.apiKey
      : new google.auth.GoogleAuth({
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
          keyFile: opts.keyFile,
        })
    this.sheets = google.sheets({
      version: 'v4',
      auth: auth || '',
    })
    this.db = opts.db
    this.table = opts.table || 'Sheet1'
    this.cacheTimeoutMs = opts.cacheTimeoutMs || 5000
  }

  _findRows(query?: Query): number[] {
    const queryKeys = _.keys(query)
    const nums: number[] = []

    _.each(this.data, (row, rowNum) => {
      if (!query || !queryKeys.length) {
        nums.push(rowNum)
        return
      }

      for (const fieldName of queryKeys) {
        if (!this.schemaMetaStore[fieldName]) {
          return
        }
        const colNum = this.schemaMetaStore[fieldName].col
        const field = row[colNum]
        if (_.toString(field) !== _.toString(query[fieldName])) {
          return
        }
      }

      nums.push(rowNum)
    })

    return nums
  }

  _rowToDoc = (row: string[]): Document => {
    const doc: Document = {}
    for (let colNum = 0; colNum < row.length; ++colNum) {
      const field = row[colNum]
      const fieldName = this.schema[colNum]
      doc[fieldName] = _.toString(field)
    }
    return doc
  }

  _docToRow = (doc: Document): string[] => {
    const row = new Array(this.schema.length)
    for (const fieldName of _.keys(doc)) {
      if (this.schemaMetaStore[fieldName]) {
        row[this.schemaMetaStore[fieldName].col] = _.toString(doc[fieldName])
      }
    }
    return row
  }

  async find(query?: Query): Promise<Document[]> {
    await this._checkCacheTimeout()

    const rowNums = this._findRows(query)
    const docs = _.map(rowNums, (rowNum) => this._rowToDoc(this.data[rowNum]))
    return docs
  }

  async insert(docs: Document[]): Promise<Document[]> {
    await this._checkCacheTimeout()

    const rows = _.map(docs, this._docToRow)

    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.db,
      range: this.table,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rows,
      },
    })
    this.data.push(...rows)

    return _.map(rows, this._rowToDoc)
  }

  async update(
    query: Query,
    toUpdate: Document,
    opts: { updatedOnce: boolean } = { updatedOnce: false },
  ): Promise<Document[]> {
    await this._checkCacheTimeout()

    const rowNums = this._findRows(query)
    const { updatedOnce } = opts
    if (!rowNums.length) {
      return []
    }

    const docs: Document[] = []
    await bluebird.map(
      updatedOnce ? [rowNums[0]] : rowNums,
      async (rowNum) => {
        const oldDoc = this._rowToDoc(this.data[rowNum])
        const newDoc = { ...oldDoc, ...toUpdate }
        const row = this._docToRow(newDoc)

        docs.push(this._rowToDoc(row))

        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.db,
          range: `${this.table}!A${rowNum + 2}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [row],
          },
        })
        this.data[rowNum] = row
      },
      { concurrency: 10 },
    )

    return docs
  }

  async remove(query: Query): Promise<Document[]> {
    await this._checkCacheTimeout()

    const rowNums = this._findRows(query)
    const emptyDoc = _.mapValues(this.schemaMetaStore, () => '')
    const emptyRow = this._docToRow(emptyDoc)
    const oldDoc: Document[] = []
    await bluebird.map(
      rowNums,
      async (rowNum) => {
        oldDoc.push(this._rowToDoc(this.data[rowNum]))

        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.db,
          range: `${this.table}!A${rowNum + 2}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [emptyRow],
          },
        })
        this.data[rowNum] = emptyRow
      },
      { concurrency: 10 },
    )

    return oldDoc
  }

  async _checkCacheTimeout(): Promise<boolean> {
    if (!this.lastUpdated || Date.now() - this.lastUpdated.getTime() >= this.cacheTimeoutMs) {
      await this.load()
      return true
    }
    return false
  }

  async load() {
    const res = await this.sheets.spreadsheets.values.get({
      range: this.table,
      spreadsheetId: this.db,
    })
    const rows = res.data.values
    if (!rows || rows.length === 0) {
      throw new Errors.StorageFormatError()
    }

    const schema = rows[0]
    const schemaMetaStore: { [key: string]: { col: number } } = _.zipObject(
      rows[0],
      _.map(rows[0], (_, colNum) => ({
        col: colNum,
      })),
    )

    this.schema = schema
    this.schemaMetaStore = schemaMetaStore
    this.data = _.slice(rows, 1)
    this.lastUpdated = new Date()
  }
}
