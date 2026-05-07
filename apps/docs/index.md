---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Web Components"
  text: "inspired by SwiftUI"
  tagline: A set of ready-to-use web components for building standalone web apps and web extensions.<br>Open Source. Open Code.
  actions:
    - theme: brand
      text: Get Started
      link: /installation/
    - theme: alt
      text: Browse Components
      link: /web-components/
# - theme: alt
#   text: What’s New in SwiftWC 1
#   link: .#no-anchor
# - theme: alt
#   text: Star on GitHub
#   link: https://github.com/swiftwc/ui

features:
  - title: TabView <span style="background:#3b83f6;padding:0.2rem 0.5rem;border-radius:30px;color:white;font-size:0.8rem;vertical-align:bottom;margin-inline:0.5rem;">Component</span>
    icon:
      src: /red.avif
      width: "100%"
    details: Create tabed views
    link: /web-components/tab-view
  - title: NavigationSplitView <span style="background:#3b83f6;padding:0.2rem 0.5rem;border-radius:30px;color:white;font-size:0.8rem;vertical-align:bottom;margin-inline:0.5rem;">Component</span>
    icon:
      src: /red.avif
      width: "100%"
    details: Create tabed views
    link: /web-components/tab-view
  - title: NavigationStack <span style="background:#3b83f6;padding:0.2rem 0.5rem;border-radius:30px;color:white;font-size:0.8rem;vertical-align:bottom;margin-inline:0.5rem;">Component</span>
    icon:
      src: /red.avif
      width: "100%"
    details: Create tabed views
    link: /web-components/tab-view
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
#no-anchor .header-anchor {
  display: none;
}
</style>

::: center

<Badge type="tip" text="✨v1" />

# What’s New in SwiftWC {#no-anchor}

::: center
