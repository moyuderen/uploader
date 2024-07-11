import Vue from 'vue'
import App from './App.vue'
import Uploader from '@tinyuploader/vue'

Vue.use(Uploader)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
