/*******************************************************************************
 *
 *                            GAPI WRAPPER
 *
 ******************************************************************************/

/**
 * Exposes methods related to the Google API Client and Auth modules.
 * As they are a part of the gapi object, each method returns
 * always a promise because it always calls it through its loader,
 * to be sure to properly load things it if ir's not present.
 * In the same manner, because things could change between two calls and
 * as the Google's guidelines suggest, the client and auth objects are
 * initialized for each call, and as this is done asynchronously it enforces
 * the promise response.
 */

/**
 * It has been done through a class definition for two reasons :
 *  * It's easier to bind this to the good things from inside a class
 *  * It allows to easily extend the class by inheritance (or its JS mimic...)
 *  * It also allows to instanciate, if needed, more than one GAPI in the same
 *    application, with different config for some edge cases.
 */

const timeout = 5000
const gapiUrl = 'https://apis.google.com/js/api.js'

export default class GAPI {
  /**
   * The constructor expect as parameter the config object, containing
   * API key, Cliend Id, the scope and the Google's discovery docs, as
   * it's defined at :
   * https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiclientinitargs
   */
  constructor (config) {
    this.config = config
  }

  /** Exposes the gapi object, loading the script and attaching it to
   *  document's head if it hasn't been done */
  _load () {
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

  /** Exposes the client object, loading it if it hasn't been done */
  _clientLoad () {
    return this._load()
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
  }

  /** Initialize the client object with config before each API call.
   *  Return the client object through a Promise. */
  _clientInit () {
    return this._clientLoad()
      .then(client => {
        return client.init(this.config)
          .then(() => {
            return Promise.resolve(client)
          }, () => {
            return Promise.reject(new Error('Error on gapi client init.'))
          })
      })
  }
}
