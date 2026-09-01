import {expect, test} from 'bun:test'

const {default: tinyhand} = await import('#src/main.ts')

test('should run', () => {
  const result = tinyhand()
  expect(result).toBe('tinyhand') // TODO Test actual functionality
})
