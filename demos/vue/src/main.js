import Vue from 'vue'
import App from './App.vue'
import Uploader from '@tiny-uploader/vue'
import '@tiny-uploader/vue/dist/style.css'

Vue.use(Uploader)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
