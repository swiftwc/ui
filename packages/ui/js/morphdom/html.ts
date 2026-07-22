type RawValue = string | number | boolean | null | undefined | RawValue[]

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch])
}

// values built via `raw` itself are trusted markup; wrap them so `stringify`
// knows to skip escaping — same idea as lit-html's `unsafeHTML`
export class TrustedMarkup {
  constructor(public readonly value: string) {}
  toString() {
    return this.value
  }
}

function stringify(value: RawValue | TrustedMarkup): string {
  if (value === null || value === undefined || value === false) return ''
  if (value instanceof TrustedMarkup) return value.value
  if (Array.isArray(value)) return value.map(stringify).join('')
  return escapeHtml(String(value))
}

export default function (strings: TemplateStringsArray, ...values: (RawValue | TrustedMarkup)[]): TrustedMarkup {
  let out = strings[0]

  for (let i = 0; i < values.length; i++) {
    out += stringify(values[i]) + strings[i + 1]
  }

  return new TrustedMarkup(out.replace(/>\s+</g, '><').trim())
}
