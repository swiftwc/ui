---
next:
  text: 'Installation'
  link: '/installation/'
---

# Introduction

_Build interfaces that feel effortless. SwiftWC brings accessible, carefully crafted components to your framework and AI tools. Free to use. Open to explore._

**This is an independent organization. It is not affiliated with, endorsed by, or sponsored by Apple Inc. or the Swift project.**

Most component libraries give you the pieces and leave the structure to you. SwiftWC starts with a clear foundation:

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme'

const coreMembers = [
    {
        name: 'NavigationStack',
        title: 'Create stacked navigation',
    avatar: '/assets/navigation_stack_role_essence_icon.svg',
     sponsor: '/web-components/navigation-stack',
     actionText: 'Start with NavigationStack',
  },
    {
        name: 'NavigationSplitView',
        title: 'Create multi-column navigation',
    avatar: '/assets/navigation_split_view_role_essence_icon.svg',
     sponsor: '/web-components/navigation-split-view',
     actionText: 'Start with NavigationSplitView',
  },
    {
        name: 'TabView',
        title: 'Create tabbed screens',
    avatar: '/assets/tab_view_role_essence_icon.svg',
     sponsor: '/web-components/tab-view',
     actionText: 'Start with TabView',
  }
]
</script>

<style>
    .VPTeamPage {
        margin-top: 2rem !important;
    }
    .VPTeamMembers {
        padding: 0 !important;
    }
    .VPTeamMembers .container {
grid-template-columns: repeat(auto-fit, minmax(184px, 1fr)) !important;
place-content:center;
}
.VPTeamMembers .container img {
border-radius: 25% !important;
}
.VPTeamMembersItem a .sp-icon{
    display:none !important;
}

</style>

<VPTeamPage>
  <VPTeamMembers size="small" :members="coreMembers" />
</VPTeamPage>
