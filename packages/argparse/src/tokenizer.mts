import { Scanner } from './scanner.mjs'
import type { Args, ArgsWith } from './types.mjs'

const ARG_SEP_RE = /[^\S]/
const ARG_DEFINITION_RE = /-{1,2}([^=\s]+)(=\S*|[^\S]*)/
const ARG_WITH_VALUE_RE = /^--([^=]+)=([\s\S]*)$/

export class Tokenizer<T extends Record<string, any>> {
  private sep: RegExp

  constructor(sep?: RegExp) {
    this.sep = sep || ARG_SEP_RE
  }

  /**
   * @param source - 原始字符串
   * @param sep - 分隔符
   */
  split(source: string, sep?: RegExp): [string, string] {
    const index = source.search(sep || this.sep)
    return [source.slice(1, index), source.slice(index)]
  }

  /**
   * @param source 原始字符串
   * @returns 参数对象
   */
  parse(source: string): ArgsWith<T> {
    const scanner = new Scanner(source)

    const args: Args = { _: '' }

    const setArg = (key: string, value: string | boolean) => {
      args[key] = value
    }

    let start: number
    let arg: string

    while (scanner.end_of_string() === false) {
      start = scanner.pos

      // -s / --verbose / --seed=3000 / --no-progress --custom-bar
      arg = scanner.scan(ARG_DEFINITION_RE).trim()
      if (!arg) {
        args._ = source.slice(start).trim()
        break
      }

      if (arg.includes('--no-')) {
        setArg(arg.replace('--no-', ''), false)
      } else if (arg.includes('=')) {
        const matches = arg.match(ARG_WITH_VALUE_RE)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (matches) setArg(matches[1]!, matches[2]!)
      } else {
        setArg(arg.replace(/^-{1,2}/, ''), true)
      }
    }

    return args as ArgsWith<T>
  }
}
