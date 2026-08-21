import { TrustedMarkup } from './render-to-string'

export default function (value: string): TrustedMarkup {
  return new TrustedMarkup(value)
}
