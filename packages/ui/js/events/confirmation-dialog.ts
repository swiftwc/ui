export type ReturnDetail = {
  returnValue: string
  positionAnchor: string
}

declare global {
  interface HTMLElementEventMap {
    return: CustomEvent<ReturnDetail>
  }
}
