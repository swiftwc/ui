import { DEBUG } from '../flags.json' with { type: 'json' }

export default function (...args: Parameters<typeof self.console.debug>) {
  DEBUG && self.console.debug(...args)
}
