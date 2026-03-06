const timeouts = new WeakMap<object, number>()

export default function (owner: object, fn: () => void, ms: number) {
  const prev = timeouts.get(owner)
  if (prev) clearTimeout(prev)

  const id = window.setTimeout(() => {
    timeouts.delete(owner)
    fn()
  }, ms)

  timeouts.set(owner, id)
}
