# tinyhand

Shorthand unroller for object parameters.

## Usage

`tinyhand.Wrap` lets an API accept either its full options object or the value of one required shorthand property. `tinyhand` normalizes either form back to the options object.

`tinyhand` accepts either a property key transformer or a function transformer. A property key wraps shorthand values under that key while leaving already expanded options unchanged. A function receives the input value and returns the full options shape.

```ts
import tinyhand from 'tinyhand'

type MakeOptions = {
  age?: number
  location?: string
  name: string
}

type MakeInput = tinyhand.Wrap<'name', MakeOptions>

const make = (input: MakeInput) => {
  const options = tinyhand('name', input)
  return options
}

make('Ada')
make({age: 36, name: 'Ada'})

const makeFromId = (id: number) => {
  return tinyhand(value => ({id: value, name: `User ${value}`}), id)
}
```

The shorthand value may itself be an object. An input is considered already expanded only when it is an object or function with its own shorthand-key property.
