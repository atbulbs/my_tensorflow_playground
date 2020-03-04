import Vue from 'vue'
import App from './app.vue'
import router from './router'
import 'styles/index.styl'

export default function createView () {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
}
