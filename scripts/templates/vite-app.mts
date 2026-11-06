import { defineTemplate } from './-types.mts'

// Paths that survive the full purge before each run.
const keep: string[] = [
    // e.g. 'public/favicon.svg'
]

// Scaffold. `{name}` is replaced by the template name. Runs inside an empty temp dir.
const scaffold = 'npm create -y vite@latest {name} -- --template vanilla-ts --no-interactive'

// Installs (inside the template).
const install = [
    'npm i -D typescript@~6.0 typescript-eslint prettier prettier-plugin-tailwindcss globals eslint @html-eslint/eslint-plugin @eslint/js @swiftwc/eslint-plugin@canary --no-package-lock --ignore-scripts',
    'npm i tailwindcss @tailwindcss/vite @swiftwc/ui@canary @phosphor-icons/web @fontsource/inter --no-package-lock --ignore-scripts',
]

// Paths to delete (relative to the template).
const deletes = ['src/counter.ts', 'src/assets', 'public/icons.svg']

// Files to write (relative path -> content).
const files: Record<string, string> = {
    '.prettierignore': `node_modules/
dist/
package-lock.json
`,

    '.prettierrc': `{
  "endOfLine": "lf",
  "semi": false,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "src/style.css"
}`,

    'eslint.config.js': `import js from "@eslint/js"
import globals from "globals"
import { defineConfig, globalIgnores } from "eslint/config"
import html from "@html-eslint/eslint-plugin"
import swiftwc from "@swiftwc/eslint-plugin/html/en"
import tseslint from "typescript-eslint"

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["**/*.html"],
    plugins: { html },
    language: "html/html",
    extends: [swiftwc.configs.recommended],
  },
])
`,

    'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>vite-app</title>
    <template id="detail-view">
      <content-view>
        <scroll-view>
          <v-stack>
            <label-view><span class="text-red-500">Hello</span></label-view>
          </v-stack>
        </scroll-view>
        <tool-bar>
          <tool-bar-item slot="top-bar-leading">
            <button type="button" tabindex="0">
              <label-view system-image="caret-left"></label-view>
            </button>
          </tool-bar-item>
        </tool-bar>
      </content-view>
    </template>
    <script type="module" src="/src/main.ts"></script>
  </head>
  <body>
    <v-keyboard system-font="Inter"></v-keyboard>

    <navigation-stack>
      <scroll-view>
        <v-stack>
          <button is="borderless-button" type="button">
            <label-view
              title="Hello world"
              system-image="hand-waving"
            ></label-view>
          </button>
        </v-stack>
      </scroll-view>
    </navigation-stack>
  </body>
</html>
`,

    'vite.config.ts': `import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [tailwindcss()],
})
`,

    'src/env.d.ts': `declare module "@phosphor-icons/web/*"
`,

    'src/style.css': `@import "tailwindcss";

@import "@swiftwc/ui/css";

@layer base, sw, components, utilities, theme;
`,

    'src/main.ts': `import "./style.css"
import { startViewTransition } from "@swiftwc/ui/client"
import "@phosphor-icons/web/bold"
import "@phosphor-icons/web/duotone"
import "@phosphor-icons/web/fill"
import "@phosphor-icons/web/light"
import "@phosphor-icons/web/regular"
import "@phosphor-icons/web/thin"

const detailView = document.querySelector<HTMLTemplateElement>("#detail-view")!

document.addEventListener("click", async ({ target }: Event) => {
  if (!(target instanceof HTMLElement)) return

  if (target.closest("tool-bar-item")) {
    await startViewTransition(target as HTMLElement, "backwards", async () => {
      document.querySelector<HTMLDivElement>("content-view")?.remove()
    })
  } else if (target.closest("button")) {
    await startViewTransition(target as HTMLElement, "forwards", async () => {
      document
        .querySelector("navigation-stack")
        ?.append(detailView.content.cloneNode(true))
    })
  }
})
`,
}

// Scripts registered in package.json, then run with `npm run` (not npx).
const scripts: Record<string, string> = {
    lint: 'eslint .',
    format: 'prettier --write .',
}
const lintAndFormat = ['npm run lint -- --fix', 'npm run format']

// Build check. If this fails, the template is left as-is and no replacements are applied.
const build = 'npm run build'

// Replacements, applied only after a successful build.
//    file (relative to the template) -> [[search, replacement], ...]; search is a string (all) or RegExp.
const replacements: Record<string, [string | RegExp, string][]> = {
    // 'index.html': [['<title>vite-app</title>', '<title>My App</title>']],
}

// Final package.json edit, applied last.
const editPackageJson = (pkg: Record<string, any>, name: string) => {
    pkg.name = name
    delete pkg.scripts.preview
    for (const field of ['dependencies', 'devDependencies']) {
        for (const dep of Object.keys(pkg[field] ?? {})) {
            if (dep.startsWith('@swiftwc/')) pkg[field][dep] = 'latest'
        }
    }
    return pkg
}

export default defineTemplate({
    keep,
    scaffold,
    install,
    deletes,
    files,
    scripts,
    lintAndFormat,
    build,
    replacements,
    editPackageJson,
})
