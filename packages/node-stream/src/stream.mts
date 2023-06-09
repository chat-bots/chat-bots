import { type Readable, isReadable } from 'node:stream'

// 兼容 CJS
import s2a from 'stream-to-async-iterator'

// @ts-ignore
const StreamToAsyncIterator = s2a.default || s2a

export async function* streamAsyncIterable(
  stream:
    | globalThis.ReadableStream<string | Buffer>
    | Readable
    | NodeJS.ReadableStream,
): AsyncGenerator<string, void, void> {
  // 标准 w3c 流
  if (stream instanceof globalThis.ReadableStream) {
    const reader = stream.getReader()
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) return

        yield value.toString()
      }
    } finally {
      reader.releaseLock()
    }
  } else {
    // nodejs 流
    for await (const text of new StreamToAsyncIterator(stream as Readable)) {
      yield text.toString()
    }
  }
}

export async function* readline<U>(
  stream: globalThis.ReadableStream | Readable | undefined | null,
  onLine: (line: string | Buffer) => Promise<U>,
): AsyncGenerator<U, void, void> {
  if (stream == null) return

  if (stream instanceof globalThis.ReadableStream || isReadable(stream)) {
    for await (const chunk of streamAsyncIterable(stream)) {
      yield onLine(chunk)
    }

    return
  }

  throw new TypeError('Expected a ReadableStream or Readable')
}
