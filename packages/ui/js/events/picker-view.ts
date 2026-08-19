export type PickerSelectionDetail = {
  selection: string
}

export type PickerSearchableDetail = {
  element: HTMLElement // dialog or body-view
  search: string //search term
}

export interface PickerSelectionEvent extends CustomEvent<PickerSelectionDetail> {}
export interface PickerSearchfocusEvent extends CustomEvent<PickerSearchableDetail> {}
export interface PickerSearchblurEvent extends CustomEvent<PickerSearchableDetail> {}
export interface PickerSearchinputEvent extends CustomEvent<PickerSearchableDetail> {}

declare global {
  interface HTMLElementEventMap {
    selection: PickerSelectionEvent
    'picker:searchfocus': PickerSearchfocusEvent
    'picker:searchblur': PickerSearchblurEvent
    'picker:searchinput': PickerSearchinputEvent
  }
}
