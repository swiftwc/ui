export type ConfirmationReturnDetail = {
  returnValue: string
  positionAnchor: string
}

export interface ConfirmationReturnEvent extends CustomEvent<ConfirmationReturnDetail> {}

declare global {
  interface HTMLElementEventMap {
    'confirmation:return': ConfirmationReturnEvent
  }
  interface DocumentEventMap {
    'confirmation:return': ConfirmationReturnEvent
  }
}
