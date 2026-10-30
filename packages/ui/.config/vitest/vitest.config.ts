import babel from '@rolldown/plugin-babel'
import { playwright } from '@vitest/browser-playwright'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from 'sass'
import { defineConfig, type Plugin } from 'vitest/config'

const root = resolve(import.meta.dirname, '../..'), // packages/ui
  ID = 'virtual:swiftwc-css'

const sassCompiled = (): Plugin => ({
  name: 'swiftwc-sass-compiled',
  resolveId: (src) => (src === ID ? `\0${ID}` : null),
  load(id) {
    if (id !== `\0${ID}`) return
    const { css, loadedUrls } = compile(resolve(root, 'scss/index.scss'), { style: 'expanded' })
    for (const url of loadedUrls) if (url.protocol === 'file:') this.addWatchFile(fileURLToPath(url))
    return `const s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.append(s)`
  },
})

export default defineConfig({
  plugins: [
    sassCompiled(),
    babel({
      presets: [
        {
          preset: () => ({
            plugins: [['@babel/plugin-proposal-decorators', { version: '2023-11' }]],
          }),
          rolldown: {
            // Only run this transform if the file contains a decorator.
            filter: { code: '@' },
          },
        },
      ],
    }),
  ],
  test: {
    // environment: 'happy-dom',
    setupFiles: [resolve(import.meta.dirname, 'vitest.setup.ts')],
    include: ['**/*.test.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
  },
})
