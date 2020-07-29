# SheetSQL

[![npm](https://img.shields.io/npm/v/sheetsql.svg)](https://www.npmjs.com/package/sheetsql)
[![CircleCI](https://circleci.com/gh/joway/sheetsql.svg?style=shield)](https://circleci.com/gh/joway/sheetsql)

Google Spreadsheet as a Database.

## Requirements

1. Create a Google Spreadsheet and populate the first row with the columns names, here is an [Example Sheet](https://docs.google.com/spreadsheets/d/1ya2Tl2ev9M80xYwspv7FJaoWq0oVOMBk3VF0f0MXv2s/edit?usp=sharing)
2. 

## Usage

### Concept

#### db

`db` means the Google Spreadsheet ID. You can find it in your sheet's URL: `https://docs.google.com/spreadsheets/d/${YOUR_SHEETS_ID}/edit`

#### table

`table` means the Sheet Name in your Spreadsheet. The default is `Sheet1`.

#### data type

Every data in sheelsql will be set/get as a string. You should handle the schema type on your side.

### Example

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
