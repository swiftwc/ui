/**
 * @example
 * compareBigDecimals("1e3", "1000") // 0
 * compareBigDecimals("1e-3", "0.001") // 0
 * compareBigDecimals("-10", "-2") // -1 ✅
 * const arr = ["1.2","1.10","1.02","1e2","100","-0.5"]
 * arr.sort(compareBigDecimals)
 * console.log(arr)
 * function isInRange(value: string, min: string, max: string): boolean {return compareBigDecimals(value, min) >= 0 && compareBigDecimals(value, max) <= 0}
 * // examples
 * isInRange("-5", "-10", "-1")   // true
 * isInRange("-11", "-10", "-1")  // false
 * isInRange("0", "-10", "-1")    // false
 * isInRange("-Infinity", "-Infinity", "-1")  // true
 * isInRange("5", "-Infinity", "Infinity")    // true
 */
const POSITIVE_INFINITY = 'Infinity',
  NEGATIVE_INFINITY = '-Infinity'

export default function (a: string, b: string): number {
  const aInf = isInfinity(a),
    bInf = isInfinity(b)

  if (aInf !== 0 || bInf !== 0) {
    if (aInf === bInf) return 0
    return aInf > bInf ? 1 : -1
  }

  const A = parse(a),
    B = parse(b)

  // different signs
  if (A.sign !== B.sign) return A.sign - B.sign

  const sign = A.sign

  // compare integer length
  if (A.i.length !== B.i.length) return (A.i.length - B.i.length) * sign

  // compare integer part
  if (A.i !== B.i) return (A.i > B.i ? 1 : -1) * sign

  // compare fractional part
  const max = Math.max(A.f.length, B.f.length)

  for (let i = 0; i < max; i++) {
    const da = A.f.charCodeAt(i) || 48, // '0'
      db = B.f.charCodeAt(i) || 48

    if (da !== db) return (da > db ? 1 : -1) * sign
  }

  return 0
}

function isInfinity(s: string): -1 | 0 | 1 {
  const t = s.trim()
  if (t === POSITIVE_INFINITY || t === '+Infinity') return 1
  if (t === NEGATIVE_INFINITY) return -1
  return 0
}

function parse(input: string) {
  let s = input.trim(),
    sign = 1

  // sign
  if (s[0] === '-') {
    sign = -1
    s = s.slice(1)
  } else if (s[0] === '+') {
    s = s.slice(1)
  }

  // scientific notation
  let exp = 0
  const eIndex = s.search(/e/i)

  if (eIndex !== -1) {
    exp = parseInt(s.slice(eIndex + 1), 10) || 0
    s = s.slice(0, eIndex)
  }

  let [i = '0', f = ''] = s.split('.')

  // remove leading zeros
  i = i.replace(/^0+/, '') || '0'

  // apply exponent by shifting decimal
  if (exp > 0) {
    const move = Math.min(exp, f.length)
    i += f.slice(0, move)
    f = f.slice(move) + '0'.repeat(exp - move)
  } else if (exp < 0) {
    const move = Math.min(-exp, i.length)
    f = i.slice(i.length - move) + f
    i = i.slice(0, i.length - move) || '0'
    f = '0'.repeat(-exp - move) + f
  }

  // normalize again
  i = i.replace(/^0+/, '') || '0'
  f = f.replace(/0+$/, '')

  return { sign, i, f }
}
