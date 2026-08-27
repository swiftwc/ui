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

export interface TabshowEvent extends CustomEvent<TabDetail> {}
export interface TabhideEvent extends CustomEvent<TabDetail> {}
export interface TabrevealEvent extends CustomEvent<TabDetail> {}
export interface TabswapEvent extends CustomEvent<TabDetail> {}
export interface BeforetabrevealEvent extends CustomEvent<TabBeforeDetail> {}
export interface BeforetabswapEvent extends CustomEvent<TabBeforeDetail> {}
export interface TabViewToggleEvent extends CustomEvent<TabViewDetail> {}
export interface TabViewAdaptableTabBarPlacementChangeEvent extends CustomEvent<TabViewAdaptableTabBarPlacementDetail> {}

declare global {
  interface HTMLElementEventMap {
    tabshow: TabshowEvent
    tabhide: TabhideEvent
    tabreveal: TabrevealEvent
    tabswap: TabswapEvent
    beforetabreveal: BeforetabrevealEvent
    beforetabswap: BeforetabswapEvent
    'tab-view:toggle': TabViewToggleEvent
    'tab-view:adaptable-tab-bar-placement-change': TabViewAdaptableTabBarPlacementChangeEvent
  }
  interface DocumentEventMap {
    tabshow: TabshowEvent
    tabhide: TabhideEvent
    tabreveal: TabrevealEvent
    tabswap: TabswapEvent
    beforetabreveal: BeforetabrevealEvent
    beforetabswap: BeforetabswapEvent
    'tab-view:toggle': TabViewToggleEvent
    'tab-view:adaptable-tab-bar-placement-change': TabViewAdaptableTabBarPlacementChangeEvent
  }
}
