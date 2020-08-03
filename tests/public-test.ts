import Database from '../src'

const DB = '1J9CLF2GZroBpxMkjCoDXiXHL9o9kREv44q3Ia8Z6nGQ'

function getDB() {
  return new Database({ db: DB, table: 'Sheet1', keyFile: './google-serviceaccount.json' })
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
