export type PickerSelectionDetail = {
  selection: string
}

declare global {
  interface HTMLElementEventMap {
    selection: CustomEvent<PickerSelectionDetail>
  }
}
