import { abbr } from "@mdit/plugin-abbr";
import { align } from "@mdit/plugin-align";
import { dl } from "@mdit/plugin-dl";
import { embed } from "@mdit/plugin-embed";
import { icon } from "@mdit/plugin-icon";
import { layout } from "@mdit/plugin-layout";
import data from "@swiftwc/ui/customElements/en" with { type: "json" };
import { defineConfig } from "vitepress";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";

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
      { text: "Editor Setup", link: "/installation/editor-setup" },
      { text: "App HTML Layout", link: "/installation/app-layout" },
      { text: "Dark Mode", link: "/installation/dark-mode" },
      { text: "JavaScript", link: "/installation/javascript" },
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

const installationsSidebar2: SidebarGroup[] = structuredClone(defaultSidebar);

const getStartedGroup2 = installationsSidebar2.find((g) => g.text === "Get Started");
if (!getStartedGroup2) throw new Error("Sidebar: 'Get Started' group not found");

const editorSetupItem = getStartedGroup2.items.find((i) => i.text === "Editor Setup");
if (!editorSetupItem) throw new Error("Sidebar: 'Editor Setup' item not found in 'Get Started'");

(installationItem.items ??= []).push(
  { text: "for Vite", link: "/installation/frameworks/vite" },
  { text: "for EmberJS", link: "/installation/frameworks/emberjs" },
  { text: "Manual", link: "/installation/frameworks/manual" },
);

(editorSetupItem.items ??= []).push(
  { text: "for Typescript", link: "/installation/editor-setup/manual" },
  { text: "for EmberJS", link: "/installation/editor-setup/emberjs" },
);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [groupIconVitePlugin()],
  },
  markdown: {
    config: (md) => {
      md.use(align);
      md.use(icon);
      md.use(layout);
      md.use(dl);
      md.use(abbr);
      //
      // md.use(vitepressDemoPlugin);
      // md.use(demo);
      //
      md.use(tabsMarkdownPlugin);
      md.use(groupIconMdPlugin, {
        titleBar: { includeSnippet: true },
      });
      md.use(embed, {
        config: [
          {
            name: "youtube",
            setup: (id: string) => `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>`,
          },
          {
            name: "icon",
            allowInline: true,
            setup: (name: string) => `<i class="ph ph-${name}"></i>`,
          },
        ],
      });
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

  head: [
    ["link", { rel: "icon", href: "/favicon.svg" }],
    ["script", { src: "https://unpkg.com/@phosphor-icons/web" }],
    ["script", { src: "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" }],
  ],

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
      "/changelog/": [{ text: "<-- Back", link: "/" }],
      "/installation/frameworks/": installationsSidebar,
      "/installation/editor-setup/": installationsSidebar2,
      "/": defaultSidebar,
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/swiftwc/ui" },
      { icon: "npm", link: "https://www.npmjs.com/org/swiftwc" },
      {
        icon: {
          svg: '<svg role="img" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256"><path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"></path></svg>',
        },
        link: "https://github.com/sponsors/swiftwc",
      },
    ],

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
