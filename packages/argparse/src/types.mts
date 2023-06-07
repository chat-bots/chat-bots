export interface Args {
  _: string
  [key: string]: any
}

export type ArgsWith<T> = Args & T
