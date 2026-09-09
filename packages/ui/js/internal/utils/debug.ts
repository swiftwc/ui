import flags from '../flags'

export default function (...args: Parameters<typeof self.console.debug>) {
  flags.DEBUG && self.console.debug(...args)
}
