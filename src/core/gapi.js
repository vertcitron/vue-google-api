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

/** Formats a GoogleUser basic profile object to something readable */
function _formatUser (guser) {
  if (!guser.getBasicProfile) return null
  const profile = guser.getBasicProfile()
  return {
    id: profile.getId(),
    name: profile.getName(),
    firstname: profile.getGivenName(),
    lastname: profile.getFamilyName(),
    image: profile.getImageUrl(),
    email: profile.getEmail()
  }
}

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

  /** Exposes a gapi library object, loading it if it hasn't been done */
  _libraryLoad (lib) {
    return this._load()
      .then(gapi => {
        if (gapi[lib]) return Promise.resolve(gapi[lib])
        return new Promise((resolve, reject) => {
          gapi.load(lib, {
            timeout: timeout,
            callback: () => {
              resolve(gapi[lib])
            },
            onerror: err => {
              reject(new Error(`Error on gapi ${lib} load: ${err.message}`))
            },
            ontimeout: () => {
              reject(new Error(`Error on gapi ${lib} load: timeout`))
            }
          })
        })
      })
  }

  /** Initialize a gapi library object with config before each API call.
   *  Return the library object through a Promise. */
  _libraryInit (lib, config = {}) {
    // fills omitted parameters wit hmain config ones if needed
    config.apiKey = config.apiKey || this.config.apiKey
    config.clientId = config.clientId || this.config.clientId
    config.scope = config.scope || this.config.scope
    config.discoveryDocs = config.discoveryDocs || this.config.discoveryDocs
    return this._libraryLoad(lib)
      .then(library => {
        return library.init(config)
          .then(response => {
            // if auth2, returns the google auth object, the library otherwise
            return Promise.resolve((lib === 'auth2') ? response : library)
          }, () => {
            return Promise.reject(new Error(`Error on gapi ${lib} init.`))
          })
      })
  }

  /** returns asynchronously true if the user is signed in */
  isSignedIn () {
    return this._libraryInit('auth2')
      .then(auth => {
        return Promise.resolve(auth.isSignedIn.get())
      })
  }

  /** returns the current user if signed in, undefined otherwise */
  currentUser () {
    return this._libraryInit('auth2')
      .then(auth => {
        if (auth.isSignedIn.get()) {
          return Promise.resolve(_formatUser(auth.currentUser.get()))
        } else {
          return Promise.resolve(null)
        }
      })
  }

  /** Starts the signin process - returns a promise resolved with the user if
   *  signin successfull, or rejected otherwise */
  signIn () {
    return this._libraryInit('auth2')
      .then(auth => {
        if (auth.isSignedIn.get()) {
          return Promise.resolve(_formatUser(auth.currentUser.get()))
        } else {
          return auth.signIn()
            .then(guser => {
              return Promise.resolve(_formatUser(guser))
            })
        }
      })
  }

  /** Disconnects the current user */
  signOut () {
    return this._libraryInit('auth2')
      .then(auth => {
        if (auth.isSignedIn.get()) {
          auth.disconnect()
        }
        return Promise.resolve()
      })
  }

  /** Makes a generic API request */
  request (args) {
    return this._libraryInit('client')
      .then(client => {
        return client.request(args)
      })
  }
}
