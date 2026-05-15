export type ConfirmationReturnDetail = {
  returnValue: string
  positionAnchor: string
}

declare global {
  interface HTMLElementEventMap {
    'confirmation:return': CustomEvent<ConfirmationReturnDetail>
  }
}
