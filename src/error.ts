export class BasicError extends Error {
  constructor(message?: string) {
    super(message || 'Unknown Error')
  }
}
