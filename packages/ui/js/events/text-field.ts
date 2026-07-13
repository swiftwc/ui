export type TextFieldCommitDetail = {
  text: string
}

declare global {
  interface HTMLElementEventMap {
    commit: CustomEvent<TextFieldCommitDetail>
  }
}

// export interface TextFieldEventMap {
//   commit: CustomEvent<TextFieldCommitDetail>
// }
