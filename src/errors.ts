import { getErrors } from './utils/error'

const errors = [
  'StorageFormatError',
  'StorageOptionError',
]

export const Errors = getErrors(errors)
