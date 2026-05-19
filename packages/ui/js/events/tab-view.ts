import { type NavigationSplitView, type NavigationStack } from '../components'
import { type TabBarPlacement } from '../components/tab-view'

export type TabBeforeDetail = {
  tag: string
  ms: number
}

export type TabDetail = {
  tag: string
}

export type TabViewDetail = {
  selection: (NavigationStack | NavigationSplitView)[] //| null
}

export type TabViewAdaptableTabBarPlacementDetail = {
  oldValue?: TabBarPlacement
  newValue?: TabBarPlacement
}

declare global {
  interface HTMLElementEventMap {
    tabshow: CustomEvent<TabDetail>
    tabhide: CustomEvent<TabDetail>
    tabreveal: CustomEvent<TabDetail>
    tabswap: CustomEvent<TabDetail>
    beforetabreveal: CustomEvent<TabBeforeDetail>
    beforetabswap: CustomEvent<TabBeforeDetail>
    'tab-view:toggle': CustomEvent<TabViewDetail>
    'tab-view:adaptable-tab-bar-placement-change': CustomEvent<TabViewAdaptableTabBarPlacementDetail>
  }
}
