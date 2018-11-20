/**************************************************************************************************
 *
 *                                GOOGLE API WRAPPER FOR VUE.JS 2
 *
 *************************************************************************************************/

import loadGAPI from './src/core/loadGAPIlib'

export default {
  /** Plugin install method */
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$gapi', {
      get: loadGAPI
    })
  }
}
