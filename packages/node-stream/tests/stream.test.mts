import { Readable } from 'node:stream'

import { assert, describe, it } from 'vitest'

import { readline, streamAsyncIterable } from '../src/index.mjs'

describe('streamAsyncIterable', () => {
  it('should iterate over a readable stream', async () => {
    const stream = new Readable({
      read() {
        this.push('hello')
        this.push('world')
        this.push(null)
      },
    })

    const chunks: string[] = []
    for await (const chunk of streamAsyncIterable(stream)) {
      chunks.push(chunk.toString())
    }

    // TODO 需要替换 stream-to-async-iterator
    assert.equal(chunks.join(''), 'helloworld')
  })
})

describe('readline', () => {
  it('should read lines from a readable stream', async () => {
    const stream = new Readable({
      read() {
        this.push('hello\n')
        this.push('world\n')
        this.push(null)
      },
    })

    const lines: string[] = []
    for await (const line of readline(stream, async line => line.toString())) {
      lines.push(line)
    }

    // TODO 需要替换 stream-to-async-iterator
    assert.deepEqual(lines.join(''), 'hello\nworld\n')
  })

  it('should throw an error if the stream is not readable', () => {
    const stream = {}

    const read = async () => {
      // @ts-ignore
      for await (const line of readline(stream, line => line.toString())) {
        console.log(line)
      }
    }

    return read().catch(error => {
      assert.equal(error.message, 'Expected a ReadableStream or Readable')
    })
  })
})
