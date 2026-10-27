import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

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
  // resolve: {
  //   alias: {
  //     '@swiftwc/ui/client': fileURLToPath(new URL('../../packages/ui/js/client', import.meta.url)),
  //   },
  // },
  server: {
    allowedHosts: ['jumpier-emersyn-unrued.ngrok-free.dev'],
  },
})
