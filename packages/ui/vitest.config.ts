import babel from '@rolldown/plugin-babel'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
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
    // setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: 'chromium' }],
    },
  },
})
