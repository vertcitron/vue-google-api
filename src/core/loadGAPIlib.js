/*******************************************************************************
 *                                 GAPI LOADER
 *******************************************************************************/

/**
 * This exports a function which dynamically loads the gapi javascript client
 * from Google, and insert it in the head of index.html markup.
 * The gapi script self register the window.gapi object which deal with various
 * Google APIs and services.
 */

/**
 * It returns a promise which is resolved when the script is fully loaded. When
 * resolved, the promise contains a reference to the gapi object.
 */

const timeout = 5000 // load waiting timeout, in milliseconds
const gapiUrl = 'https://apis.google.com/js/api.js'

/**
 * Calls the internal gapi client load then calls the resolve or reject
 * passed functions depending on the result.
 */
function clientLoad (resolve, reject) {
  window.gapi.load('client', {
    timeout: 5000,
    callback: () => {
      resolve(window.gapi)
    },
    onerror: err => {
      reject(new Error('gapi client load error: ' + err.message))
    },
    ontimeout: () => {
      reject(new Error('gapi client load timeout.'))
    }
  })
}

export default function () {
  // if the script and the client are already loaded, resolve immediately
  if (window.gapi && window.gapi.client) {
    return Promise.resolve(window.gapi)
  }
  // if the script is loaded but not the client, load it
  if (window.gapi && !window.gapi.client) {
    return new Promise((resolve, reject) => {
      clientLoad(resolve, reject)
    })
  }
  // Otherwise load the script first then the client
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = gapiUrl
    // sets a time limit to load the script, reject promise if outdated.
    let limit = setTimeout(() => {
      script.remove()
      reject(new Error('gapi load timeout.'))
    }, timeout)
    document.head.appendChild(script)
    script.onload = () => {
      clearTimeout(limit)
      // let's reject if the global gapi object has not been created
      if (!window.gapi) reject(new Error('gapi load error.'))
      clientLoad(resolve, reject)
    }
  })
}
