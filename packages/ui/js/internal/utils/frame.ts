export default function (element?: Element) {
  return new Promise<number | null>((r) => {
    if (element && !element.isConnected) return r(null)

    return self.requestAnimationFrame(r)
  })
}
