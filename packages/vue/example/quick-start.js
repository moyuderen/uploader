import Vue from 'vue'
import App from './quick-start.vue'
import Uploader from '../src/index'
// import Uploader from '../dist/tinyuploader-vue.mjs'
// import '../dist/style.css'

Vue.use(Uploader)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
