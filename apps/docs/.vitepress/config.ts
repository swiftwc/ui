import { defineConfig } from "vitepress";
import { align } from "@mdit/plugin-align";
import { icon } from "@mdit/plugin-icon";
import { layout } from "@mdit/plugin-layout";
// import { demo } from "@mdit/plugin-demo";
// import { tab } from "@mdit/plugin-tab";

const defaultSidebar = [
  {
    text: "Sections",
    items: [
      { text: "Introduction", link: "/intro" },
      { text: "Web Components", link: "/web-components/" },
      { text: "Installation", link: "/installation/" },
    ],
  },
  {
    text: "Web Components",
    items: [
      // {
      //   text: 'Structure',
      // items: [
      // ------------------------------------------------------------------------------------------------
      // SOSSS IMPORTANT: First component has CUSTOM PREV MODIFICATIONS!!
      { text: "BodyView", link: "/web-components/body-view" },
      // SOSSS IMPORTANT: First component has CUSTOM PREV MODIFICATIONS!!
      // ------------------------------------------------------------------------------------------------
      { text: "NavigationStack", link: "/web-components/navigation-stack" },
      {
        text: "NavigationSplitView",
        link: "/web-components/navigation-split-view",
      },
      { text: "TextField", link: "/web-components/text-field" },
      // ------------------------------------------------------------------------------------------------
      // SOSSS IMPORTANT: Last component has CUSTOM PREV MODIFICATIONS!!
      { text: "VStack", link: "/web-components/v-stack" },
      // SOSSS IMPORTANT: Last component has CUSTOM PREV MODIFICATIONS!!
      // ------------------------------------------------------------------------------------------------
      // { text: 'Runtime API Examples', link: '/api-examples' }
      // ]
      // }
    ],
  },
  {
    text: "Get Started",
    items: [
      { text: "Installation", link: "/installation/", items: [] },
      { text: "App HTML Layout", link: "/installation/app-layout" },
      { text: "Dark Mode", link: "/installation/dark-mode" },
      { text: "JavaScript", link: "/installation/javascript" },
      { text: "Editor Setup", link: "/installation/editor-setup" },
      // { text: 'Runtime API Examples', link: '/api-examples' }
    ],
  },
];

const installationsSidebar = structuredClone(defaultSidebar);

installationsSidebar
  .find((item) => item.text === "Get Started")
  .items.find((item) => item.text === "Installation")
  .items.push(
    { text: "for Vite", link: "/installation/frameworks/vite" },
    { text: "for EmberJS", link: "/installation/frameworks/emberjs" },
    { text: "Manual", link: "/installation/frameworks/manual" },
  );

// https://vitepress.dev/reference/site-config
export default defineConfig({
  markdown: {
    config: (md) => {
      md.use(align);
      md.use(icon);
      md.use(layout);
      // md.use(demo, {
      //   // your options, name is required
      //   name: "demo",
      // });
      // md.use(tab, {
      //   // your options, name is required
      //   name: "tabs",
      // });
      // md.use(require('markdown-it-footnote'))
    },
  },

  cleanUrls: true,

  lang: "en-US",

  head: [["link", { rel: "icon", href: "/favicon.svg" }]],

  title: "SwiftWC",
  description: "Elegant SwiftUI-inspired web components for standalone web apps and web extensions.",

  sitemap: {
    hostname: "https://swiftwc.dev",
    lastmodDateOnly: false,
  },

  themeConfig: {
    externalLinkIcon: true,
    i18nRouting: true,
    logo: { light: "/logo-light.svg", dark: "/logo-dark.svg" },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/installation/" },
    ],

    sidebar: {
      "/installation/frameworks/": installationsSidebar,
      "/": defaultSidebar,
    },

    socialLinks: [{ icon: "github", link: "https://github.com/swiftwc/ui" }],

    footer: {
      message: "<small>This is an independent organization. It is not affiliated with, endorsed by, or sponsored by Apple Inc. or the Swift project.</small>",
      copyright: 'Released under the <a href="https://github.com/swiftwc/ui/blob/main/LICENSE.md" target="_blank">MIT License</a>.',
    },

    search: {
      provider: "local",
    },
  },
});
