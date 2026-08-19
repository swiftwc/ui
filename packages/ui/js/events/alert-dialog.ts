export type AlertReturnDetail = {
  returnValue: string
}

export interface AlertReturnEvent extends CustomEvent<AlertReturnDetail> {}

declare global {
  interface HTMLElementEventMap {
    'alert:return': AlertReturnEvent
  }
}
