export type DatePickerSelectionDetail = {
  selection: string
}

declare global {
  interface HTMLElementEventMap {
    selection: CustomEvent<DatePickerSelectionDetail>
  }
}
