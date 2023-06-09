import assert from 'node:assert'
import { Script, createContext } from 'node:vm'

import type { DOMWindow } from 'jsdom'

import { createSandboxContext } from './context.mjs'

export type SandboxOptions = {
  filename?: string
  domain?: string
  code?: string
}

export class Sandbox<Window extends DOMWindow = DOMWindow> {
  filename?: string
  domain: string

  window?: Window

  code?: string

  script?: Script

  constructor(code?: string, opts?: SandboxOptions) {
    this.code = code || ''
    this.filename = opts?.filename
    this.domain = opts?.domain || 'http://example.com'

    if (code) this.compile(code)
  }

  execute(): unknown {
    const script = this.script

    assert(script, 'No script to execute')

    const window = this.createWindow()
    const result = script.runInContext(createContext(window))

    this.window = window

    return result
  }

  createWindow(): Window {
    return createSandboxContext({
      url: this.domain,
    })
  }

  compile(code: string): Script {
    const script = new Script(code)
    this.code = code
    this.script = script
    return script
  }
}
