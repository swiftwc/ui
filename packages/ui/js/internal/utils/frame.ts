export default function (element?: Element) {
  return new Promise<number>((r) => self.requestAnimationFrame(r)).then((t) => {
    if (!element || element.isConnected) return t
  })
}
