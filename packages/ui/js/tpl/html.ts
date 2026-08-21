// Purely structural — captures strings/values as-is. render.ts relies on
// `strings` identity (TemplateStringsArray) for its template cache, so this
// must stay exactly this shape: no wrapping, no cloning, no new object
// allocation beyond the literal { strings, values }.

export interface TemplateResult {
  strings: TemplateStringsArray
  values: unknown[]
}

export default function (strings: TemplateStringsArray, ...values: unknown[]): TemplateResult {
  return { strings, values }
}
