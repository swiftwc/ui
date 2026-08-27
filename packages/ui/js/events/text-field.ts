export type TextFieldCommitDetail = {
  text: string
}

export interface TextFieldCommitEvent extends CustomEvent<TextFieldCommitDetail> {}

declare global {
  interface HTMLElementEventMap {
    commit: TextFieldCommitEvent
  }
  interface DocumentEventMap {
    commit: TextFieldCommitEvent
  }
}
