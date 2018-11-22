/*******************************************************************************
 *
 *                            MAIN GAPI LOADER
 *
 ******************************************************************************/

/**
 * Exports the main gapi loader.
 * This is done through a promise because it's loaded asynchronously
 * if it's not present.
 * As the google script is intended to be attached to a markup file,
 * it is loaded in a <script> DOM element and attached to the <head>
 * element of the index.html file. Then the script attach the gapi object
 * itself globally to window.
 */

const timeout = 5000 // load waiting timeout, in milliseconds
const gapiUrl = 'https://apis.google.com/js/api.js'

export default function load () {
  // resolves immediately if already loaded
  if (window.gapi) return Promise.resolve(window.gapi)

  // otherwise prepares and loads
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = gapiUrl
    let limit = setTimeout(() => {
      // reject promise in case of a timeout.
      script.remove()
      reject(new Error('gapi load timeout.'))
    }, timeout)
    document.head.appendChild(script)

    // defines the callback that resolves on successful load
    script.onload = () => {
      clearTimeout(limit)
      // let's reject if the global gapi object has not been created
      if (!window.gapi) reject(new Error('gapi load error.'))

      // otherwise, everything is ok, resolves
      resolve(window.gapi)
    }
  })
}
