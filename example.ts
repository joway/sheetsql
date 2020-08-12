import * as bluebird from 'bluebird'
import Database from './src'

const DB = '1gSb-_vI8jk53UPaCXU9YGfeq2C9v2_k9tYC4ibdut98'

const main = async () => {
  const db = new Database({ db: DB, table: 'Sheet1', keyFile: './google-serviceaccount.json' })
  let count = 0
  while (true) {
    await db.insert([
      {
        name: `user-${count}`,
        age: count,
      },
    ])
    if (count % 3 === 1) {
      await db.remove({
        age: count - 1,
      })
    }
    count++

    console.log(`processed item ${count}`)
    await bluebird.delay(100)
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(-1)
  })
