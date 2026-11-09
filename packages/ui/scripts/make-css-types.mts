import { mkdir, writeFile } from 'node:fs/promises'

await mkdir('generated/css', { recursive: true })

await writeFile('generated/css/index.d.ts', 'export {};\n')
