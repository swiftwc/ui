import { template } from 'es-toolkit/compat'
import { readFileSync, writeFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { resolve } from 'node:path'

// Tagged template that just returns the string (the `html` tag name enables editor highlighting/formatting)
const html = (strings: TemplateStringsArray, ...values: unknown[]) => String.raw({ raw: strings }, ...values)

// SECTION
const viteIndex = html`<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="/src/style.<%= style %>" rel="stylesheet" />
      <script type="module" src="/src/main.<%= script %>"></script>
    </head>
    <body>
      <!-- [!code ++] -->
      <v-keyboard system-font="Inter"></v-keyboard>

      <!-- [!code ++] -->
      <navigation-stack>
        <!-- [!code ++] -->
        <scroll-view>
          <!-- [!code ++] -->
          <v-stack>
            <!-- [!code ++] -->
            <button is="borderless-button" type="button" tabindex="0">
              <!-- [!code ++] -->
              <label-view title="Say hello" system-image="hand-waving"></label-view>
              <!-- [!code ++] -->
            </button>
            <!-- [!code ++] -->
          </v-stack>
          <!-- [!code ++] -->
        </scroll-view>
        <!-- [!code ++] -->
      </navigation-stack>
    </body>
  </html>`

// index.html -> {foo,bar,baz...}/index.html
for (const [dir, script, style] of [
  ['jscss', 'js', 'css'],
  ['jsscss', 'js', 'scss'],
  ['tscss', 'ts', 'css'],
  ['tsscss', 'ts', 'scss'],
])
  writeFileSync(resolve(import.meta.dirname, `../snippets/installation/vite/${dir}/index.html`), template(viteIndex)({ script, style }))

// .ts -> .js
for (const path of ['../snippets/installation/vite/main.ts', '../snippets/installation/emberjs/app.ts']) {
  const file = resolve(import.meta.dirname, path)

  // const { name } = parse(file)

  writeFileSync(`${file.replace('.ts', '.js')}`, stripTypeScriptTypes(readFileSync(file, 'utf8'), { mode: 'strip' }))
}
