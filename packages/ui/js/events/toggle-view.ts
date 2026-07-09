export type ToggleChangeDetail = {
  isOn: boolean
  value: string | null
}

declare global {
  interface HTMLElementEventMap {
    change: CustomEvent<ToggleChangeDetail>
  }
}
