export default function (x: number, y: number, rect: DOMRect): boolean {
  const { left, right, top, bottom } = rect

  return left <= x && x <= right && top <= y && y <= bottom
}
