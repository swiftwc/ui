import { type ScrollView } from '../components'

export type PageRevealSwapDetail = {
  page: ScrollView
}

export interface PagerevealEvent extends CustomEvent<PageRevealSwapDetail> {}
export interface PageswapEvent extends CustomEvent<PageRevealSwapDetail> {}

declare global {
  interface HTMLElementEventMap {
    pagereveal: PagerevealEvent
    pageswap: PageswapEvent
  }
}
