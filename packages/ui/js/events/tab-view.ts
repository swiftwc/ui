import { type NavigationStack } from '../components/navigation-stack'
import { type NavigationSplitView } from '../components/navigation-split-view'

export type PageRevealSwapDetail = {
  page: HTMLElement
}

export type TabRevealSwapDetail = {
  tag: string
}

export type TabViewChangeDetail = {
  selection: (NavigationStack | NavigationSplitView)[] //| null
}

export type TabMoreStackAllowanceDetail = {
  moreTab: NavigationStack | null
}

declare global {
  interface HTMLElementEventMap {
    tabreveal: CustomEvent<TabRevealSwapDetail>
    tabswap: CustomEvent<TabRevealSwapDetail>
    beforetabreveal: CustomEvent<TabRevealSwapDetail>
    beforetabswap: CustomEvent<TabRevealSwapDetail>
    'tab-view:change': CustomEvent<TabViewChangeDetail>
    pagereveal: CustomEvent<PageRevealSwapDetail>
    pageswap: CustomEvent<PageRevealSwapDetail>
    'tab-view:more-tab-allowed': CustomEvent<TabMoreStackAllowanceDetail>
    'tab-view:more-tab-disallowed': CustomEvent<TabMoreStackAllowanceDetail>
  }
}
