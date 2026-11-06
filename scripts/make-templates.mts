// Rebuild templates under ../templates without touching the monorepo root.
// Usage: node scripts/make-templates.mts [--sequential] [template-name ...]
//
// Each template is configured in scripts/templates/<name>.mts (default export of defineTemplate).
// Steps per template (cwd = templates/<name>), each optional:
//   1. purge the entire template folder, except `keep` paths
//   2. scaffold (temp dir, copied over the template)
//   3. install
//   4. deletes
//   5. files
//   6. scripts registered in package.json, then lintAndFormat
//   7. build check, then dist is removed (failure stops everything below)
//   8. replacements, then editPackageJson (last, so npm never rewrites it)
import { exec } from 'node:child_process'
import { cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { parseArgs, promisify, styleText } from 'node:util'
import type { TemplateConfig } from './templates/-types.mts'

const sh = promisify(exec)
const templatesDir = join(import.meta.dirname, '..', 'templates')
const configsDir = join(import.meta.dirname, 'templates')

// Delete everything inside `dir` except the `keep` paths (relative to `dir`, may be nested).
async function purge(dir: string, keep: string[], rel = '') {
    for (const entry of await readdir(join(dir, rel))) {
        const path = rel ? `${rel}/${entry}` : entry
        if (keep.includes(path)) continue
        if (keep.some((k) => k.startsWith(`${path}/`))) await purge(dir, keep, path)
        else await rm(join(dir, path), { recursive: true, force: true })
    }
}

async function make(name: string, config: TemplateConfig) {
    const dir = join(templatesDir, name)
    await mkdir(dir, { recursive: true })
    const log = (step: string) => console.log(`${styleText('cyan', name.padEnd(14))} ${step}`)
    const run = async (cmd: string, cwd = dir) => {
        log(cmd.length > 80 ? `${cmd.slice(0, 77)}...` : cmd)
        await sh(cmd, { cwd })
    }
    const pkgPath = join(dir, 'package.json')
    const readPkg = async () => JSON.parse(await readFile(pkgPath, 'utf8')) as Record<string, any>
    const writePkg = (pkg: Record<string, any>) => writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)

    // 1. purge everything inside templates/<name> except `keep` (the folder itself stays)
    if (!name || name.includes('/') || name.startsWith('.')) throw new Error(`refusing to purge "${name}"`)
    await purge(dir, (config.keep ?? []).map((k) => k.replace(/\/+$/, '')))
    log(`purged (kept: ${config.keep?.join(', ') || 'nothing'})`)

    // 2. scaffold into an empty temp dir, then copy over the template (nothing is deleted)
    if (config.scaffold) {
        const tmp = await mkdtemp(join(tmpdir(), 'make-template-'))
        try {
            await run(config.scaffold.replaceAll('{name}', name), tmp)
            await cp(join(tmp, name), dir, { recursive: true, force: true })
        } finally {
            await rm(tmp, { recursive: true, force: true })
        }
    }

    // 3. install
    for (const cmd of config.install ?? []) await run(cmd)

    // 4. deletes
    for (const path of config.deletes ?? []) await rm(join(dir, path), { recursive: true, force: true })

    // 5. files
    for (const [path, content] of Object.entries(config.files ?? {})) {
        const target = join(dir, path)
        await mkdir(dirname(target), { recursive: true })
        await writeFile(target, content)
    }

    // 6. scripts, then lint + format through them
    if (config.scripts) {
        const pkg = await readPkg()
        Object.assign((pkg.scripts ??= {}), config.scripts)
        await writePkg(pkg)
    }
    for (const cmd of config.lintAndFormat ?? []) await run(cmd)

    // 7. build check: a failure throws and skips everything below
    if (config.build) {
        await run(config.build)
        await rm(join(dir, 'dist'), { recursive: true, force: true })
        log(styleText('green', 'build ok, dist removed'))
    }

    // 8. replacements, then package.json last
    for (const [file, pairs] of Object.entries(config.replacements ?? {})) {
        const path = join(dir, file)
        let text = await readFile(path, 'utf8')
        for (const [search, to] of pairs) {
            text = typeof search === 'string' ? text.replaceAll(search, to) : text.replace(search, to)
        }
        await writeFile(path, text)
    }
    if (config.editPackageJson) await writePkg(config.editPackageJson(await readPkg(), name))

    log(styleText('green', 'done'))
}

const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { sequential: { type: 'boolean', default: false } },
})

// Template name = config file name (scripts/templates/<name>.mts, excluding types.mts)
const available = (await readdir(configsDir))
    .filter((f) => f.endsWith('.mts') && f !== '-types.mts')
    .map((f) => f.slice(0, -'.mts'.length))
const names = positionals.length ? available.filter((n) => positionals.includes(n)) : available
const unknown = positionals.filter((n) => !available.includes(n))
if (unknown.length) throw new Error(`unknown template(s): ${unknown.join(', ')} (available: ${available.join(', ')})`)

const configs = await Promise.all(
    names.map(async (n) => [n, (await import(join(configsDir, `${n}.mts`))).default as TemplateConfig] as const),
)

if (values.sequential) {
    for (const [name, config] of configs) await make(name, config)
} else {
    const results = await Promise.allSettled(configs.map(([name, config]) => make(name, config)))
    const failed = results.flatMap((r, i) => (r.status === 'rejected' ? [[configs[i][0], r.reason] as const] : []))
    for (const [name, reason] of failed) console.error(styleText('red', `${name} failed:`), reason)
    if (failed.length) process.exitCode = 1
}
