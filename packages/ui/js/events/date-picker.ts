export type DatePickerSelectionDetail = {
  selection: string
}

export interface DatePickerSelectionEvent extends CustomEvent<DatePickerSelectionDetail> {}

declare global {
  interface HTMLElementEventMap {
    selection: DatePickerSelectionEvent
  }
  interface DocumentEventMap {
    selection: DatePickerSelectionEvent
  }
}
