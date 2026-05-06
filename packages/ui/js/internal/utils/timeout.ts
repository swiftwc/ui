export default function () {
  let id: number | undefined

  const cancel = () => {
      if (!id) return

      self.clearTimeout(id)
      id = undefined
    },
    next = (fn: () => void, ms: number) => {
      cancel()

      id = self.setTimeout(() => {
        fn()

        id = undefined
      }, ms)
    },
    pending = () => undefined !== id

  return { next, cancel, pending }
}
