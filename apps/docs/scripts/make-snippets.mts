import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module'
import { dirname, resolve } from 'node:path'

const here = (path: string) => resolve(import.meta.dirname, path)

const template = here('../../../templates/vite-app')
const out = here('../snippets/installation/vite')

type Replacement = readonly [from: string, to: string]

const apply = (code: string, replacements: readonly Replacement[]) =>
  replacements.reduce((acc, [from, to]) => {
    if (!acc.includes(from)) throw new Error(`not found: ${from}`)
    return acc.replace(from, to)
  }, code)

const write = async (path: string, content: string) => {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, content)
  console.log('wrote', path.slice(out.length + 1))
}

// one entry per snippet variant
const variants = [
  { dir: 'tscss', ts: true, style: 'css' },
  { dir: 'tsscss', ts: true, style: 'scss' },
  { dir: 'jscss', ts: false, style: 'css' },
  { dir: 'jsscss', ts: false, style: 'scss' },
] as const

const mainTs = await readFile(`${template}/src/main.ts`, 'utf8')
const indexHtml = await readFile(`${template}/index.html`, 'utf8')

for (const { dir, ts, style } of variants) {
  const ext = ts ? 'ts' : 'js'

  // main.ts: swap the stylesheet import (template ships `import "./style.css"`)
  const mainReplacements: Replacement[] = []
  if (style === 'scss') mainReplacements.push(['import "./style.css"', 'import "./style.scss"'])
  const main = apply(mainTs, mainReplacements)

  // index.html: point the entry script at the right file
  const htmlReplacements: Replacement[] = []
  if (!ts) htmlReplacements.push(['<script type="module" src="/src/main.ts">', '<script type="module" src="/src/main.js">'])
  const html = apply(indexHtml, htmlReplacements)

  await write(`${out}/${dir}/main.${ext}`, ts ? main : stripTypeScriptTypes(main, { mode: 'strip' }))
  await write(`${out}/${dir}/index.html`, html)
}
