export default function (ms: number) {
  let id: number, cancel!: () => void

  const promise = new Promise<void>((resolve) => {
    id = self.setTimeout(resolve, ms)
    cancel = () => self.clearTimeout(id)
  })

  return { promise, cancel }
}
