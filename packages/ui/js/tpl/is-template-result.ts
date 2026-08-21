import type { TemplateResult } from './html'

export default (v: unknown): v is TemplateResult => !!v && typeof v === 'object' && 'strings' in (v as any) && 'values' in (v as any)
