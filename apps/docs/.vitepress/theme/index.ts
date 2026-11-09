import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import 'virtual:group-icons.css'
import type { EnhanceAppContext, Theme } from 'vitepress'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

import '@shikijs/vitepress-twoslash/style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: EnhanceAppContext) {
    enhanceAppWithTabs(app)
    app.use(TwoslashFloatingVue)
  },
} satisfies Theme
