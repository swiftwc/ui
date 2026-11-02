import babel from '@rolldown/plugin-babel'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      babel({
        presets: [
          {
            preset: () => ({
              plugins: [['@babel/plugin-proposal-decorators', { version: '2023-11' }]],
            }),
            rolldown: {
              filter: { code: /^\s*@[A-Za-z_$]/m }, // Only run this transform if the file contains a decorator.
            },
          },
        ],
      }),
    ],
    // resolve: {
    //   alias: {
    //     'virtual:app-script': resolve(import.meta.dirname, env.VITE_SCRIPT_URL),
    //   },
    // },
    resolve: {
      alias: {
        'virtual:app-script': fileURLToPath(new URL(env.VITE_SCRIPT_URL, import.meta.url)),
        'virtual:@swiftwc/ui/client': fileURLToPath(new URL(env.VITE_CLIENT_URL, import.meta.url)),
      },
    },
    server: {
      allowedHosts: ['jumpier-emersyn-unrued.ngrok-free.dev'],
    },
  }
})
