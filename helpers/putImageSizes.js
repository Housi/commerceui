import { breakpoints } from '@theme'

const putImageSizes = (arr) => {
  let sizes

  sizes = `${arr[0]}`

  breakpoints.forEach((b, i) => {
    if (arr[i] === arr[i + 1]) {
      return
    } // don't make useless breakpoints

    if (arr[i + 1]) {
      sizes = `(min-width: ${b.value}px) ${arr[i + 1]}, ${sizes}`
    }
  })

  return sizes
}

export default putImageSizes
