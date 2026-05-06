export default function (ms: number) {
  return new Promise<void>((r) => self.setTimeout(r, ms))
}
