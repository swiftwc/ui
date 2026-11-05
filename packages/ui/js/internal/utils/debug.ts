import devFlags from '../dev-flags.ts'

export default function (...args: Parameters<typeof self.console.debug>) {
  devFlags.DEBUG && self.console.debug(...args)
}
