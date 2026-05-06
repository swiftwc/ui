export default function (cssTime: string) {
  return parseFloat(cssTime) * (/\ds$/.test(cssTime) ? 1000 : 1)
}
