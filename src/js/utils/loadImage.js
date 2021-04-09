/**
 * Loads an image from an url, returning a promise (with the image element or error) and a cancel function
 *
 * @param {string} src
 * @returns {[Promise<HTMLImageElement|Error>, function]}
 */
const loadImage = (src) => {
  let cancel = () => {}
  return [
    new Promise((resolve, reject) => {
      const image = new Image()
      const unlisten = () => {
        image.removeEventListener("load", onLoaded)
        image.removeEventListener("error", onError)
      }
      cancel = () => {
        unlisten()
        resolve(new Error("canceled"))
      }
      const onLoaded = () => {
        unlisten()
        resolve(image)
      }
      const onError = (error) => {
        unlisten()
        reject(error)
      }
      image.addEventListener("load", onLoaded)
      image.addEventListener("error", onError)
      image.src = src
    }),
    cancel,
  ]
}

export default loadImage
