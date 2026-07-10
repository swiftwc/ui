export interface TemplateResult {
  strings: TemplateStringsArray
  values: unknown[]
}

export default function (strings: TemplateStringsArray, ...values: unknown[]): TemplateResult {
  return { strings, values }
}
