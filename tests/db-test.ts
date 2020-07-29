import Database from '../src'

const DB = '1ya2Tl2ev9M80xYwspv7FJaoWq0oVOMBk3VF0f0MXv2s'

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
}, 10000)
