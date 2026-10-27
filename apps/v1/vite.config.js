import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

function decoratorPreset(options) {
  return {
    preset: () => ({
      plugins: [['@babel/plugin-proposal-decorators', options]],
    }),
    rolldown: {
      // Only run this transform if the file contains a decorator.
      filter: {
        code: '@',
      },
    },
  }
}

export default defineConfig({
  plugins: [babel({ presets: [decoratorPreset({ version: '2023-11' })] })],
  // resolve: {
  //   alias: {
  //     '@swiftwc/ui/client': fileURLToPath(new URL('../../packages/ui/js/client', import.meta.url)),
  //   },
  // },
  server: {
    allowedHosts: ['jumpier-emersyn-unrued.ngrok-free.dev'],
  },
})
