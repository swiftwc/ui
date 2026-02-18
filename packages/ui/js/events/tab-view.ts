export type TabRevealDetail = {
  tag: string
}

export type TabViewChangeDetail = {
  selection: HTMLElement[]
}

declare global {
  interface HTMLElementEventMap {
    tabreveal: CustomEvent<TabRevealDetail>
    tabswap: CustomEvent<TabRevealDetail>
    'tab-view:change': CustomEvent<TabViewChangeDetail>
  }
}
