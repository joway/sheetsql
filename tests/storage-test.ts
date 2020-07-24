import * as bluebird from 'bluebird'
import sheetsql from '../src'

test('storage simple get', () => {
  const ls = new sheetsql()
  ls.set('test', 'val', 1000)
  const v = ls.get('test')
  expect(v).toBe('val')
})

test('storage timeout', async () => {
  const ls = new sheetsql()
  ls.set('test', 'val', 1)

  await bluebird.delay(2)
  const v = ls.get('test')
  expect(v).toBeNull()
})

test('storage flush', async () => {
  const ls = new sheetsql()
  ls.set('test', 'val')
  let v = ls.get('test')
  expect(v).toBe('val')

  ls.flush()
  v = ls.get('test')
  expect(v).toBeNull()
})
