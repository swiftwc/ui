export type ToggleChangeDetail = {
  isOn: boolean
  value: string | null
}

declare global {
  interface HTMLElementEventMap {
    'toggle:change': CustomEvent<ToggleChangeDetail>
  }
}

// export interface ToggleViewEventMap {
//   'toggle:change': CustomEvent<ToggleChangeDetail>
// }
