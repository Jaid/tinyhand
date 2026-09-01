import {expect, test} from 'bun:test'

import tinyhand from '#src/main.ts'

type PersonOptions = {
  age?: number
  location?: string
  name: string
}

type PersonInput = tinyhand.Wrap<'name', PersonOptions>

test('wraps a shorthand value', () => {
  expect(tinyhand('name', 'Ada')).toEqual({name: 'Ada'})
})
test('wraps a shorthand value under multiple keys', () => {
  const result: {
    displayName: string
    name: string
  } = tinyhand(['name', 'displayName'], 'Ada')
  expect(result).toEqual({
    displayName: 'Ada',
    name: 'Ada',
  })
})
test('returns multiply expanded options unchanged', () => {
  const input = {
    displayName: 'Ada Lovelace',
    name: 'Ada',
  }
  expect(tinyhand(['name', 'displayName'], input)).toBe(input)
})
test('requires every array key to recognize expanded options', () => {
  const input = {name: 'Ada'}
  expect(tinyhand(['name', 'displayName'], input)).toEqual({
    displayName: input,
    name: input,
  })
})
test('supports an empty key array', () => {
  expect(tinyhand([], 'Ada')).toEqual({})
})
test('returns expanded options unchanged', () => {
  const input: PersonOptions = {
    age: 36,
    name: 'Ada',
  }
  const result = tinyhand('name', input)
  expect(result).toBe(input)
})
test('infers expanded options from a wrapped union', () => {
  const input: PersonInput = Math.random() > 0.5 ? 'Ada' : {
    age: 36,
    name: 'Ada',
  }
  const result: PersonOptions = tinyhand('name', input)
  expect(result.name).toBe('Ada')
})
test('supports object shorthand values', () => {
  const config = {enabled: true}
  expect(tinyhand('config', config)).toEqual({config})
})
test('supports null and undefined shorthand values', () => {
  let undefinedInput: undefined
  expect(tinyhand('value', null)).toEqual({value: null})
  expect(tinyhand('value', undefinedInput)).toEqual({value: undefined})
})
test('uses own-key presence to recognize expanded values', () => {
  const prototype = {name: 'prototype'}
  const input = Object.assign(Object.create(prototype) as object, {age: 36})
  expect(tinyhand('name', input)).toEqual({name: input})
})
test('treats shorthand keys as literal property keys', () => {
  const nested = {
    a: {b: true},
  }
  expect(tinyhand('a.b', nested)).toEqual({'a.b': nested})
  const expanded = {'a.b': true}
  expect(tinyhand('a.b', expanded)).toBe(expanded)
})
test('supports function transformers', () => {
  const transform = (name: string): PersonOptions => ({name})
  const result: PersonOptions = tinyhand(transform, 'Ada')
  expect(result).toEqual({name: 'Ada'})
})
