import { type ScrollView } from '../components'

export type PageRevealSwapDetail = {
  page: ScrollView
}

declare global {
  interface HTMLElementEventMap {
    pagereveal: CustomEvent<PageRevealSwapDetail>
    pageswap: CustomEvent<PageRevealSwapDetail>
  }
}

// export interface ScrollViewEventMap {
//   pagereveal: CustomEvent<PageRevealSwapDetail>
//   pageswap: CustomEvent<PageRevealSwapDetail>
// }
