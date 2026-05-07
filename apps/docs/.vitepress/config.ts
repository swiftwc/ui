import { abbr } from "@mdit/plugin-abbr";
import { align } from "@mdit/plugin-align";
import { dl } from "@mdit/plugin-dl";
import { icon } from "@mdit/plugin-icon";
import { layout } from "@mdit/plugin-layout";
import data from "@swiftwc/ui/customElements/en" with { type: "json" };
import { defineConfig } from "vitepress";

interface SidebarItem {
  text: string;
  link?: string;
  items?: SidebarItem[];
}

interface SidebarGroup {
  text: string;
  items: SidebarItem[];
}

const defaultSidebar: SidebarGroup[] = [
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
    items: await Promise.all(
      (await Promise.all(data.modules)).map(async (item) => ({
        text: item.declarations[0].name ?? "",
        link: `/web-components/${item.declarations[0].tagName}`,
      })),
    ),
  },
  {
    text: "Get Started",
    items: [
      { text: "Installation", link: "/installation/", items: [] },
      { text: "App HTML Layout", link: "/installation/app-layout" },
      { text: "Dark Mode", link: "/installation/dark-mode" },
      { text: "JavaScript", link: "/installation/javascript" },
      { text: "Editor Setup", link: "/installation/editor-setup" },
      // {
      //   text: "Examples",
      //   items: [
      //     { text: "Hello World PWA", link: "/installation/hello-world-pwa" },
      //     { text: "Hello World Web Ext", link: "/installation/hello-world-web-ext" },
      //   ],
      // },
    ],
  },
];

const installationsSidebar: SidebarGroup[] = structuredClone(defaultSidebar);

const getStartedGroup = installationsSidebar.find((g) => g.text === "Get Started");
if (!getStartedGroup) throw new Error("Sidebar: 'Get Started' group not found");

const installationItem = getStartedGroup.items.find((i) => i.text === "Installation");
if (!installationItem) throw new Error("Sidebar: 'Installation' item not found in 'Get Started'");

(installationItem.items ??= []).push(
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
      md.use(dl);
      md.use(abbr);
      // md.use(field);
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

  base: "/",

  locales: {
    root: {
      label: "English",
      lang: "en-US",
    },
    // fr: {
    //   label: "French",
    //   lang: "fr", // optional, will be added  as `lang` attribute on `html` tag
    //   link: "/fr/guide", // default /fr/ -- shows on navbar translations menu, can be external

    //   // other locale specific properties...
    // },
  },

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
      {
        text: "v1.0-alpha.1",
        items: [
          { text: "What’s New", link: "/changelog" },
          // { text: "Sponsor Open Source", link: "https://github.com/sponsors/swiftwc" },
        ],
      },
    ],

    sidebar: {
      "/installation/frameworks/": installationsSidebar,
      "/": defaultSidebar,
    },

    socialLinks: [{ icon: "github", link: "https://github.com/swiftwc/ui" }],

    footer: {
      message:
        "<small>SwiftUI is a trademark of Apple Inc. This is an independent organization—not affiliated with, endorsed by, or sponsored by Apple Inc. or the Swift project.</small>",
      copyright: 'Released under the <a href="https://github.com/swiftwc/ui/blob/main/LICENSE.md" target="_blank">MIT License</a>.',
    },

    search: {
      provider: "local",
    },
  },
});
