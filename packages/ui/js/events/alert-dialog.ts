export type AlertReturnDetail = {
  returnValue: string
}

declare global {
  interface HTMLElementEventMap {
    'alert:return': CustomEvent<AlertReturnDetail>
  }
}
