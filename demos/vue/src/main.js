import Vue from 'vue'
import App from './App.vue'
import Uploader from '@tinyUploader/vue'
import '@tinyUploader/vue/dist/style.css'

Vue.use(Uploader)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
