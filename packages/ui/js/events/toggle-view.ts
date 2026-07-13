export type ToggleChangeDetail = {
  isOn: boolean
  value: string | null
}

declare global {
  interface HTMLElementEventMap {
    'picker:change': CustomEvent<ToggleChangeDetail>
  }
}

export interface ToggleViewEventMap {
  'picker:change': CustomEvent<ToggleChangeDetail>
}
