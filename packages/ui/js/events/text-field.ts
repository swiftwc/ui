export type TextFieldCommitDetail = {
  text: string
}

export interface TextFieldEventMap {
  commit: CustomEvent<TextFieldCommitDetail>
}

// declare global {
//   interface HTMLElementEventMap {
//     commit: CustomEvent<TextFieldCommitDetail>
//   }
// }
