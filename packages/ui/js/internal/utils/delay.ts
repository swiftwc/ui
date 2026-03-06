const delays = new WeakMap<object, { cancel: () => void }>() // const delays = new WeakMap<object, { id: number; cancel: () => void }>()

export default function (owner: object, ms: number): Promise<void> {
  delays.get(owner)?.cancel() //const prev = delays.get(owner)if (prev) prev.cancel()

  let resolve!: () => void

  const promise = new Promise<void>((r) => {
    resolve = r
  })

  const id = self.setTimeout(() => {
    delays.delete(owner)
    resolve()
  }, ms)

  const cancel = () => {
    self.clearTimeout(id)
    delays.delete(owner)
    resolve() // resolve canceled promise but still task doesnt run
  }

  delays.set(owner, { cancel }) // delays.set(owner, { id, cancel })

  return promise
}
