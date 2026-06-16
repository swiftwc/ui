export type PickerSelectionDetail = {
  selection: string
}

export type PickerSearchableDetail = {
  element: HTMLElement // dialog or body-view
  search: string //search term
}

declare global {
  interface HTMLElementEventMap {
    selection: CustomEvent<PickerSelectionDetail>
    'picker:searchfocus': CustomEvent<PickerSearchableDetail>
    'picker:searchblur': CustomEvent<PickerSearchableDetail>
    'picker:searchinput': CustomEvent<PickerSearchableDetail>
  }
}
