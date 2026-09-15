import devFlags from '../dev-flags'

export default function (...args: Parameters<typeof self.console.debug>) {
  devFlags.DEBUG && self.console.debug(...args)
}
