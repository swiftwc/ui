export type TabRevealSwapDetail = {
  tag: string
}

export type TabViewChangeDetail = {
  selection: HTMLElement[]
}

declare global {
  interface HTMLElementEventMap {
    tabreveal: CustomEvent<TabRevealSwapDetail>
    tabswap: CustomEvent<TabRevealSwapDetail>
    beforetabreveal: CustomEvent<TabRevealSwapDetail>
    beforetabswap: CustomEvent<TabRevealSwapDetail>
    'tab-view:change': CustomEvent<TabViewChangeDetail>
  }
}
