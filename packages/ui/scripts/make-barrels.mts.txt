import { glob, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { parseArgs } from 'node:util'

const { values, positionals: dirs } = parseArgs({
  allowPositionals: true,
  options: {
    partial: { type: 'boolean', default: false },
    recursive: { type: 'boolean', default: false },
  },
})

for (const dir of dirs) {
  const abs = resolve(dir)
  if (!(await stat(abs).catch(() => null))?.isDirectory()) {
    throw new Error(`Not a directory: ${abs}`)
  }

  const name = basename(abs)
  const out = join(dirname(abs), `${values.partial ? '_' : ''}${name}.scss`)

  const files = (await Array.fromAsync(glob(values.recursive ? '**/*.scss' : '*.scss', { cwd: abs })))
    .map((f) =>
      f
        .replaceAll('\\', '/')
        .replace(/\.scss$/, '')
        .replace(/(^|\/)_/, '$1')
    )
    .toSorted()

  const body = files.map((f) => `@forward "./${name}/${f}";`).join('\n\n')
  await writeFile(out, `// !! AUTO GENERATED DON’T TOUCH !!\n\n${body}\n`)
  console.log(`${out} (${files.length})`)
}
