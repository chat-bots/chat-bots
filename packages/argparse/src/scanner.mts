export class Scanner {
  /**
   * 剩余字符串
   */
  tail: string

  /**
   * 当前位置
   */
  pos: number

  constructor(source: string) {
    this.tail = source
    this.pos = 0
  }

  /**
   * 根据特定前缀提取字符串
   *
   * @param prefix - 前缀文本
   * @param suffix - 后缀文本
   * @returns 被提取的字符串
   */
  extract(prefix: string, suffix?: string): string | null {
    const tail = this.tail
    const index = tail.indexOf(prefix)

    if (index === -1) return null

    const start = index + prefix.length

    let value = tail.substring(start)

    if (suffix) {
      const end = value.indexOf(suffix)
      if (end > -1) value = value.substring(0, end)
    }

    // 索引从 0 开始，所以需要减回去
    this.pos += start - 1
    this.tail = tail.substring(start - 1)

    return value
  }

  /**
   * 扫描并提取字符串
   * @param matcher
   * @returns 扫描到的字符串
   */
  scan(matcher: RegExp | string): string {
    const tail = this.tail
    const match = tail.match(matcher)

    if (!match) return ''

    const string = match[0]
    const len = match?.index || string.length

    this.tail = tail.substring(len)
    this.pos += len

    return string
  }

  /**
   * 搜索并提取字符串
   * @param searcher
   * @returns 提取的字符串
   */
  search(searcher: RegExp | string): string {
    const tail = this.tail
    const index = tail.search(searcher)

    let match = ''

    switch (index) {
      case -1:
        match = tail
        this.tail = ''
        break
      case 0:
        match = ''
        break
      default:
        match = tail.substring(0, index)
        this.tail = tail.substring(index)
    }

    this.pos += match.length

    return match
  }

  /**
   * 是否已经到达字符串末尾
   */
  end_of_string(): boolean {
    return !this.tail.trim()
  }
}
