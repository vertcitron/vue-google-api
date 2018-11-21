/**************************************************************************************************
 *
 *                                GOOGLE API WRAPPER FOR VUE.JS 2
 *
 *************************************************************************************************/

import gapi from './src/core/gapi'

export default {
  /** Plugin install method */
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$gapi', { value: gapi })
  }
}
