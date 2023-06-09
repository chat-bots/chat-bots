import type { Readable } from 'node:stream'

import { type ParseEvent, createParser } from 'eventsource-parser'

import { readline } from './stream.mjs'

export function readResponseStream(
  stream: globalThis.ReadableStream | Readable | undefined | null,
): AsyncGenerator<ParseEvent, void, void> {
  let next: (value: ParseEvent) => void

  const parser = createParser(event => next(event))

  return readline(stream, chunk => {
    return new Promise<ParseEvent>((resolve) => {
      next = resolve
      parser.feed(chunk.toString())
    })
  })
}
