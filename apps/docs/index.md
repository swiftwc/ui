---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Web Components'
  text: 'inspired by SwiftUI'
  tagline: A set of ready-to-use web components for building standalone web apps and web extensions.<br>Open Source. Open Code.
  image:
    light:
      src: /assets/logo-light.svg
      alt: SwiftWC
    dark:
      src: /assets/logo-dark.svg
      alt: SwiftWC
  actions:
    - theme: brand
      text: Get Started
      link: /installation/
    - theme: alt
      text: View Components
      link: /web-components/
# - theme: alt
#   text: What’s New in SwiftWC 1
#   link: .#no-anchor
# - theme: alt
#   text: Star on GitHub
#   link: https://github.com/swiftwc/ui

features:
  - title: TabView <span class="mx-2 rounded-full bg-[#3b83f6] px-2 py-[0.2rem] align-bottom text-[0.8rem] text-white font-semibold">Component</span>
    icon:
      src: /assets/tab_view_role_essence.png
      width: '100%'
    details: Create tabbed screens
    link: /web-components/tab-view
  - title: NavigationSplitView <span class="mx-2 rounded-full bg-[#3b83f6] px-2 py-[0.2rem] align-bottom text-[0.8rem] text-white font-semibold">Component</span>
    icon:
      src: /assets/navigation_split_view_role_essence.png
      width: '100%'
    details: Create multi-column navigation
    link: /web-components/navigation-split-view
  - title: NavigationStack <span class="mx-2 rounded-full bg-[#3b83f6] px-2 py-[0.2rem] align-bottom text-[0.8rem] text-white font-semibold">Component</span>
    icon:
      src: /assets/navigation_stack_role_essence.png
      width: '100%'
    details: Create stacked navigation
    link: /web-components/navigation-stack
---

<style>
#VPContent > * {
  display: flex;
  flex-direction: column;
}
#VPContent > * > :nth-child(1) {
  order: 1;
}
#VPContent > * > :nth-child(2) {
  order: 3;
}
#VPContent > * > :nth-child(3) {
  order: 2;
  margin-bottom: 3rem;
}
</style>

::: center

<Badge type="tip" text="✨v1" />

# What’s New in SwiftWC {#no-anchor}

::: center
