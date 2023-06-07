import { assert, test } from 'vitest'

import { Scanner } from '../src/scanner.mjs'

test('Scanner can extract content with prefix and suffix', () => {
  const scanner = new Scanner('Hello, world!')
  const content = scanner.extract('Hello', '!')
  assert.equal(content, ', world')
})

test('Scanner can scan for a regular expression', () => {
  const scanner = new Scanner('Hello, world!')
  const match = scanner.scan(/Hello/)
  assert.equal(match, 'Hello')
})

test('Scanner can scan until a regular expression is found', () => {
  const scanner = new Scanner('Hello, world!')
  const match = scanner.search(/,/)
  assert.equal(match, 'Hello')
})

test('Scanner can detect end of string', () => {
  const scanner = new Scanner('')
  assert.equal(scanner.end_of_string(), true)
})
