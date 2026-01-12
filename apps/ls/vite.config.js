import { defineConfig } from 'vite'

export default defineConfig({
  root: 'public',
  server: {
    allowedHosts: ['jumpier-emersyn-unrued.ngrok-free.dev'],
  },
})
