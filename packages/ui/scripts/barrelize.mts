import { Barrelsby } from 'barrelsby/bin/index.js'
import { readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'

// usage: node scripts/barrelize.mts <dir> [--exportDefault] [--fullPathname]
const { values, positionals: dirs } = parseArgs({
  allowPositionals: true,
  options: {
    exportDefault: { type: 'boolean', default: false },
    fullPathname: { type: 'boolean', default: false },
  },
})

for (const dir of dirs) {
  Barrelsby({
    directory: [dir],
    name: 'index',
    location: 'top',
    // structure: 'flat',
    delete: true,
    noHeader: true,
    singleQuotes: true,
    noSemicolon: true,
    exclude: ['.\\.test\\.ts'],
    ...(values.exportDefault && { exportDefault: true }),
    ...(values.fullPathname && { fullPathname: true }),
  })

  // barrelsby strips extensions; Node-style resolution needs them
  const file = join(resolve(dir), 'index.ts')
  const src = await readFile(file, 'utf8')
  await writeFile(file, src.replace(/(from '\.\/[^']+?)(?:\.ts)?'/g, "$1.ts'"))
  console.log(file)
}
