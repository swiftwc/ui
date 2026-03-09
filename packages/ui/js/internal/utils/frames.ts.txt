import frame from './frame'

export default async function (n = 1) {
  while (n--) await frame()
}
