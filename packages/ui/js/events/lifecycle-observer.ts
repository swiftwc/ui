import { type ScrollView } from '../components'

export type PageShowHideDetail = {
  page: ScrollView
}

export interface PageShowEvent extends CustomEvent<PageShowHideDetail> {}
export interface PageHideEvent extends CustomEvent<PageShowHideDetail> {}

declare global {
  interface HTMLElementEventMap {
    pageshow: PageShowEvent
    pagehide: PageHideEvent
  }
  interface DocumentEventMap {
    pageshow: PageShowEvent
    pagehide: PageHideEvent
  }
}
