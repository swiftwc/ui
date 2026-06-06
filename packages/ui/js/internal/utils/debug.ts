export default function debug(...data: any[]) {
  return console.debug('%c swift-wc', 'color:hsl(200,70%,45%);font-weight:600', ...data)
}
