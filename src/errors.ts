import { getErrors } from './utils/error'

const errors = [
  'StorageOptionsError',
  'StorageFormatError',
  'StorageOptionError',
]

export const Errors = getErrors(errors)
