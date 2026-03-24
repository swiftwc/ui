import { type ScrollView } from '../components'

export type PageShowHideDetail = {
  page: ScrollView
}

declare global {
  interface HTMLElementEventMap {
    pageshow: CustomEvent<PageShowHideDetail>
    pagehide: CustomEvent<PageShowHideDetail>
  }
}
