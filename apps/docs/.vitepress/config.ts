import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "SwiftWC",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/installation/' }
    ],

    sidebar: [
      {
        text: 'Sections',
        items: [
          { text: 'Introduction', link: '/intro' },
          { text: 'Web Components', link: '/web-components/' },
          { text: 'Installation', link: '/installation/' }
        ]
      },
      {
        text: 'Web Components',
        items: [
          // {
          //   text: 'Structure',
            // items: [
              { text: 'Aaaa', link: '/web-components/aaaa' },
              { text: 'NavigationStack', link: '/web-components/navigation-stack' },
              { text: 'NavigationSplitView', link: '/web-components/navigation-split-view' },
              { text: 'Zzzz', link: '/web-components/zzzz' },
              // { text: 'Runtime API Examples', link: '/api-examples' }
            // ]
          // }
        ]
      },
      {
        text: 'Get Started',
        items: [
          { text: 'Installation', link: '/installation/' },
          { text: 'App HTML Layout', link: '/installation/app-layout' },
          { text: 'Dark Mode', link: '/installation/dark-mode' },
          { text: 'JavaScript', link: '/installation/javascript' },
          // { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/swiftwc/ui' }
    ]
  }
})
