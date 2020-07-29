import Database from '../src'

const DB = '1ya2Tl2ev9M80xYwspv7FJaoWq0oVOMBk3VF0f0MXv2s'

beforeEach(async () => {
  const db = new Database({ db: DB, table: 'Sheet1', keyFile: './google-serviceaccount.json' })
  await db.load()

  await db.remove({})
})

test('db simple', async () => {
  const db = new Database({ db: DB, table: 'Sheet1', keyFile: './google-serviceaccount.json' })
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
  const db = new Database({ db: DB, table: 'Sheet1', keyFile: './google-serviceaccount.json' })
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
