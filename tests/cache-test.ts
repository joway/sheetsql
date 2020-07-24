import * as bluebird from 'bluebird'
import { LocalCache } from '../src'

test('cache wrapper', async () => {
  const cache = new LocalCache({ timeout: 100 })
  const testFunc = function (a: number, b: number) {
    return a + b
  }
  let ret = await cache.wrapper(`${testFunc.name}:1,2`, testFunc, 1, 2)
  expect(ret).toBe(3)

  ret = await cache.wrapper(`${testFunc.name}:2,3`, testFunc, 2, 3)
  expect(ret).toBe(5)

  ret = await cache.wrapper(`${testFunc.name}:1,2`, testFunc, 1, 2)
  expect(ret).toBe(3)

  expect(cache.storage.get(`${testFunc.name}:1,2`)).toBe(3)
  await bluebird.delay(100)
  expect(cache.storage.get(`${testFunc.name}:1,2`)).toBeNull()
  ret = await cache.wrapper(`${testFunc.name}:1,2`, testFunc, 1, 2)
  expect(ret).toBe(3)
})
