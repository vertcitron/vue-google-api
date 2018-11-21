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

const $gapi = {
  /** the config objet will store the application API configuration */
  config: {},

  /** Exposes the gapi object asynchronously */
  load: () => {
    // resolve immediately if already loaded
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
      script.onload = () => {
        clearTimeout(limit)
        // let's reject if the global gapi object has not been created
        if (!window.gapi) reject(new Error('gapi load error.'))
        // everything is ok, resolves
        resolve(window.gapi)
      }
    })
  },

  /** methods related to the client object */
  client: {
    /** Exposes the client object asynchronously */
    load: () => {
      return $gapi.load()
        .then(gapi => {
          if (gapi.client) return Promise.resolve(gapi.client)
          return new Promise((resolve, reject) => {
            gapi.load('client', {
              timeout: timeout,
              callback: () => {
                resolve(gapi.client)
              },
              onerror: err => {
                reject(new Error(`Error on gapi client load: ${err.message}`))
              },
              ontimeout: () => {
                reject(new Error(`Error on gapi client load: timeout`))
              }
            })
          })
        })
    },

    /** initialize the client with the config object or another one passed */
    init: () => {
      return $gapi.client.load()
        .then(client => {
          return client.init($gapi.config)
            .then(() => {
              return client
            })
        })
    }
  }
}

export default $gapi
