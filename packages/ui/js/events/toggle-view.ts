export type ToggleChangeDetail = {
  isOn: boolean
  value: string | null
}

export interface ToggleViewEventMap {
  commit: CustomEvent<ToggleChangeDetail>
}

// declare global {
//   interface HTMLElementEventMap {
//     commit: CustomEvent<ToggleChangeDetail>
//   }
// }
