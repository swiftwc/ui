import { TrustedMarkup } from './render-to-string.ts'

export default function (value: string): TrustedMarkup {
  return new TrustedMarkup(value)
}
