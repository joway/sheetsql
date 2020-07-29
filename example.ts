import Database from './src'

const DB = '1ya2Tl2ev9M80xYwspv7FJaoWq0oVOMBk3VF0f0MXv2s'

const main = async () => {
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
}
