import { Tokenizer } from './tokenizer.mjs'
import type { Args } from './types.mjs'

export class ArgumentParser<T extends Args = Args> {
  private tokenizer = new Tokenizer<T>()

  /**
   * @remarks 出于性能考虑，默认只有以 / 开头的字符串才会被解析
   *
   * @example
   * const parser = new ArgumentParser()
   * parser.parse('/imagline --no-progress --seed=3003 --verbose cat')
   * //=> ['imagline', { _: 'cat', progress: false, seed: '3003', verbose: true }]
   *
   * @param source
   * @returns 解析结果
   */
  parse(source: string): readonly [string, T] | void {
    if (source.startsWith('/') === false) return

    const [cmd, argv] = this.tokenizer.split(source)
    return [cmd, this.tokenizer.parse(argv)] as const
  }
}
