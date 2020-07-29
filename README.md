# SheetSQL

[![npm](https://img.shields.io/npm/v/sheetsql.svg)](https://www.npmjs.com/package/sheetsql)
[![CircleCI](https://circleci.com/gh/joway/sheetsql.svg?style=shield)](https://circleci.com/gh/joway/sheetsql)

Google Spreadsheet as a Database.

## Usage

```typescript
const db = new Database({ db: DB, keyFile: './google-serviceaccount.json' })
await db.load()

let docs = await db.insert([
  {
    name: 'joway',
    age: 18,
  },
])

docs = await db.update(
  {
    name: 'joway',
  },
  {
    age: 100,
  },
)

docs = await db.find({
  name: 'joway',
})

docs = await db.remove({
  name: 'joway',
})
```
