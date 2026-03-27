export default function (nf: Intl.NumberFormat) {
  const parts = nf.formatToParts(1.1)

  return parts.find(({ type }) => 'decimal' === type)?.value ?? '.'
}
