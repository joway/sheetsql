export interface ErrorInput {}

export function getErrors(errors: string[]) {
  const Err: { [key: string]: new () => Error } = {}
  for (const errName of errors) {
    Err[errName] = class extends Error {
      constructor() {
        super()
        this.name = errName
      }
    }
  }
  return Err
}
