export default function () {
  return new Promise<number>((r) => self.requestAnimationFrame(r))
}
