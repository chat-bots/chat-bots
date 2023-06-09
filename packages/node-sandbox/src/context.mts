import { type ConstructorOptions, type DOMWindow, JSDOM } from 'jsdom'

const noopPromise = Promise.resolve()
const noop = function () {
  // pass
}
const asyncNoop = function () {
  return noopPromise
}

const fakeConsole = Object.keys(console).reduce(
  (con, name) => ({ ...con, [name]: noop }),
  {},
)

/**
 * @param opts
 * @returns
 */
export function createSandboxContext<T extends DOMWindow = DOMWindow>(
  opts?: ConstructorOptions,
): T {
  const { window } = new JSDOM('', opts)

  /**
   * @type {Record<string, any>}
   */
  const context = {
    ...window,
    name: '',
    Window: window.Window,
    fetch: asyncNoop,
    fakeConsole,
    setTimeout: noop,
    clearTimeout: noop,
    setInterval: noop,
    clearInterval: noop,
    requestAnimationFrame: noop,
    idleCallback: noop,
    cancelIdleCallback: noop,
    requestIdleCallback: noop,
    cancelAnimationFrame: noop,
  }

  // @ts-ignore
  context.global = context.window = context.globalThis = context.self = context

  Object.getOwnPropertyNames(window).forEach(name => {
    if (name in context) return

    const descriptor = Object.getOwnPropertyDescriptor(window, name)
    if (descriptor) Object.defineProperty(context, name, descriptor)
  })

  // @ts-ignore
  return context
}
