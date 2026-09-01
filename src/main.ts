import type {If, IsNever} from 'type-fest'

import {has} from 'es-toolkit/compat'

type Normalized<Key extends PropertyKey, Input> = If<IsNever<Key>, Record<Key, Input>, If<IsNever<Extract<Input, Record<Key, unknown>>>, Record<Key, Input>, Extract<Input, Record<Key, unknown>>>>

const isKeyArray = (value: unknown): value is ReadonlyArray<PropertyKey> => Array.isArray(value)
function tinyhand<Input, Options>(transformer: (input: Input) => Options, input: Input): Options
function tinyhand<Key extends PropertyKey, Input>(transformer: Key, input: Input): Normalized<Key, Input>
function tinyhand<const Keys extends ReadonlyArray<PropertyKey>, Input>(transformer: Keys, input: Input): Normalized<Keys[number], Input>
function tinyhand(transformer: ((input: never) => unknown) | PropertyKey | ReadonlyArray<PropertyKey>, input: unknown) {
  if (typeof transformer === 'function') {
    return transformer(input as never)
  }
  if (isKeyArray(transformer)) {
    if (transformer.length === 0) {
      return {}
    }
    if (transformer.every(key => has(input, [key]))) {
      return input
    }
    return Object.fromEntries(transformer.map(key => [key, input]))
  }
  if (has(input, [transformer])) {
    return input
  }
  return {[transformer]: input}
}
namespace tinyhand {
  export type Wrap<Key extends PropertyKey, Options extends Record<Key, unknown>> = Options | Options[Key]
}

export default tinyhand
