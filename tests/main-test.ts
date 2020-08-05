import Database from '../src'

// https://docs.google.com/spreadsheets/d/1ya2Tl2ev9M80xYwspv7FJaoWq0oVOMBk3VF0f0MXv2s/edit#gid=0
const DB = '1ya2Tl2ev9M80xYwspv7FJaoWq0oVOMBk3VF0f0MXv2s'

function getDB(table = 'Sheet1') {
  return new Database({ db: DB, table, keyFile: './google-serviceaccount.json' })
}

beforeEach(async () => {
  const db = getDB()
  await db.load()

  await db.remove({})
})

afterAll(async () => {
  const db = getDB()
  await db.load()

  await db.remove({})
})

test('db simple', async () => {
  const db = getDB()
  await db.load()

  let docs = await db.insert([
    {
      name: 'joway',
      age: 18,
    },
  ])
  expect(docs.length).toBe(1)
  expect(docs[0].name).toBe('joway')
  expect(docs[0].age).toBe('18')

  docs = await db.update(
    {
      name: 'joway',
    },
    {
      age: 100,
    },
  )
  expect(docs[0].name).toBe('joway')
  expect(docs[0].age).toBe('100')

  docs = await db.find({
    name: 'joway',
  })
  expect(docs[0].name).toBe('joway')

  docs = await db.remove({
    name: 'joway',
  })
  expect(docs[0].name).toBe('joway')

  docs = await db.find({
    name: 'joway',
  })
  expect(docs.length).toBe(0)
}, 30000)

test('db find', async () => {
  const db = getDB()
  await db.load()

  let docs = await db.insert([
    {
      name: 'jack',
      age: 18,
    },
    {
      name: 'mark',
      age: 21,
    },
    {
      name: 'jason',
      age: 18,
      no: 1,
    },
  ])
  expect(docs.length).toBe(3)

  docs = await db.find({
    age: 18,
  })
  expect(docs.length).toBe(2)

  docs = await db.find({
    age: '18',
  })
  expect(docs.length).toBe(2)

  docs = await db.find({})
  expect(docs.length).toBe(3)

  docs = await db.find({ no: 1 })
  expect(docs.length).toBe(0)

  docs = await db.find({ name: '' })
  expect(docs.length).toBe(0)

  let doc = await db.updateOne({ name: 'jack' }, { name: '' })
  expect(doc!.name).toBe('')

  docs = await db.find({ name: '' })
  expect(docs.length).toBe(1)
}, 30000)
