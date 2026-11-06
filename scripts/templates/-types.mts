type Pkg = Record<string, any>
type Replacements = Record<string, [string | RegExp, string][]>

/** Every step is optional: a template only declares what it needs. */
export interface TemplateConfig {
    /** Paths (relative to the template) that survive the full purge. Everything else is deleted before each run. */
    keep?: string[]
    /** Scaffold command run in an empty temp dir, copied over the template. `{name}` = template name. */
    scaffold?: string
    /** Commands run inside the template after scaffolding (installs etc.). */
    install?: string[]
    /** Paths to delete, relative to the template. */
    deletes?: string[]
    /** Files to write: relative path -> content. */
    files?: Record<string, string>
    /** package.json scripts to register before lint/format/build run. */
    scripts?: Record<string, string>
    /** Commands run after files are written (e.g. `npm run lint -- --fix`). */
    lintAndFormat?: string[]
    /** Build check command; failure skips the rest. `dist` is removed afterwards. */
    build?: string
    /** Text replacements applied after a successful build. */
    replacements?: Replacements
    /** Final package.json edit, applied last. */
    editPackageJson?: (pkg: Pkg, name: string) => Pkg
}

export const defineTemplate = (config: TemplateConfig) => config
