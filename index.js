/**************************************************************************************************
 *
 *                                GOOGLE API WRAPPER FOR VUE.JS 2
 *
 *************************************************************************************************/

import GAPI from './src/core/gapi'
import GoogleSigninBtn from './src/components/GoogleSigninBtn'

export default {
  /** Plugin install method */
  install (Vue, config) {
    Object.defineProperty(Vue.prototype, '$gapi', { value: new GAPI(config) })
    Vue.component('GoogleSigninBtn', GoogleSigninBtn)
  }
}
