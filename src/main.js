import Vue from 'vue'
import App from './App.vue'
import VueGoogleApi from '../index.js'

Vue.config.productionTip = false

Vue.use(VueGoogleApi)

new Vue({
  render: h => h(App)
}).$mount('#app')
