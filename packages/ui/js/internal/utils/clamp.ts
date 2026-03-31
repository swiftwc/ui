export default function (value?: string, min: number = Infinity, max: number = Infinity): number {
  const intVal = Math.floor(Number(value))

  return Math.min(Math.max(intVal, min), max)
}
