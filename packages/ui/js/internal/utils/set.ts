export default function <T extends object, K extends keyof T>(obj: T, key: K, value: T[K]): boolean {
  if (!Object.is(obj[key], value)) {
    obj[key] = value

    return true
  }

  return false
}
