import flags from '../flags.json' with { type: 'json' }

export default function (...args: Parameters<typeof self.console.debug>) {
  flags.DEBUG && self.console.debug(...args)
}
