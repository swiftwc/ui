export default function (x: number, y: number, rect: DOMRect): boolean {
  const { left, right, top, bottom } = rect

  return x >= left && x <= right && y >= top && y <= bottom
}
