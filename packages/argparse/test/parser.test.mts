import { assert, test } from 'vitest'

import { ArgumentParser } from '../src/parser.mjs'

test('ArgumentParser', async () => {
  const parser = new ArgumentParser()

  assert.deepEqual(
    parser.parse('/imagline --no-progress --seed=3003 --verbose cat'),
    ['imagline', { _: 'cat', progress: false, seed: '3003', verbose: true }],
  )

  assert.deepEqual(parser.parse('/imagline --seed=3003 cat'), [
    'imagline',
    { _: 'cat', seed: '3003' },
  ])

  assert.deepEqual(parser.parse('/imagline cat'), ['imagline', { _: 'cat' }])

  assert.deepEqual(parser.parse('imagline cat'), undefined)
})
