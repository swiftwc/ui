export type ToggleChangeDetail = {
  isOn: boolean
  value: string | null
}

export interface ToggleChangeEvent extends CustomEvent<ToggleChangeDetail> {}

declare global {
  interface HTMLElementEventMap {
    'toggle:change': ToggleChangeEvent
  }
  interface DocumentEventMap {
    'toggle:change': ToggleChangeEvent
  }
}
