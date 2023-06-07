import { assert, test } from 'vitest'

import { Tokenizer } from '../src/tokenizer.mjs'

test('parse: should parse arguments correctly', () => {
  const tokenizer = new Tokenizer<{ foo: string; bar: boolean }>()
  const args = tokenizer.parse('--foo=hello --bar')

  assert.deepEqual(args, {
    foo: 'hello',
    bar: true,
    _: '',
  })
})

test('parse: should parse arguments with no value correctly', () => {
  const tokenizer = new Tokenizer<{ foo: boolean; 'custom-bar': boolean }>()
  const args = tokenizer.parse('--foo --custom-bar')

  assert.deepEqual(args, {
    foo: true,
    'custom-bar': true,
    _: '',
  })
})

test('parse: should parse arguments with no value and --no- prefix correctly', () => {
  const tokenizer = new Tokenizer<{ foo: boolean }>()
  const args = tokenizer.parse('--no-foo')

  return [args.foo === false, args._ === '']
})

test('parse: should parse arguments with short flag correctly', () => {
  const tokenizer = new Tokenizer<{ f: boolean }>()
  const args = tokenizer.parse('-f')

  assert.deepEqual(args, {
    f: true,
    _: '',
  })
})

test('split: should split the source string correctly', () => {
  const tokenizer = new Tokenizer()
  const [head, tail] = tokenizer.split('/imagline --foo=hello world')

  assert.equal(head, 'imagline')
  assert.equal(tail, ' --foo=hello world')
})
