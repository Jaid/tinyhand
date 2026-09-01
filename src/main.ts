import type {If, IsNever} from 'type-fest'

import {has} from 'es-toolkit/compat'

type Normalized<Key extends PropertyKey, Input> = If<IsNever<Extract<Input, Record<Key, unknown>>>, Record<Key, Input>, Extract<Input, Record<Key, unknown>>>

function tinyhand<Input, Options>(transformer: (input: Input) => Options, input: Input): Options
function tinyhand<Key extends PropertyKey, Input>(transformer: Key, input: Input): Normalized<Key, Input>
function tinyhand(transformer: ((input: never) => unknown) | PropertyKey, input: unknown) {
  if (typeof transformer === 'function') {
    return transformer(input as never)
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
