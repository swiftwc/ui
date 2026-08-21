import { isTemplateResult, type TemplateResult } from '../tpl'

// morph.ts and queryMorph.ts only need something with `.toString()` that
// yields a safe, escaped HTML string — this is that, built on top of the
// same TemplateResult instead of a separate tag function.

// values built via `raw` itself are trusted markup; wrap them so `stringify`
// knows to skip escaping — same idea as lit-html's `unsafeHTML`
export class TrustedMarkup {
  constructor(public readonly value: string) {}
  toString() {
    return this.value
  }
}

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

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined || value === false) return ''
  if (value instanceof TrustedMarkup) return value.value
  if (isTemplateResult(value)) return renderToString(value).value
  if (Array.isArray(value)) return value.map(stringifyValue).join('')
  return escapeHtml(String(value))
}

/**
 * Flatten a TemplateResult (from `html`) into an escaped TrustedMarkup
 * string. Use this only at morph/queryMorph call sites — anywhere feeding
 * `render()` should keep passing the raw TemplateResult straight through.
 */
export default function renderToString(template: TemplateResult): TrustedMarkup {
  let out = template.strings[0]

  for (let i = 0; i < template.values.length; i++) {
    out += stringifyValue(template.values[i]) + template.strings[i + 1]
  }

  return new TrustedMarkup(out.replace(/>\s+</g, '><').trim())
}
