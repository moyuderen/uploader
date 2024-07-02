import { createApp } from 'vue'
import App from './App.vue'
// import uploader from '@uploader/vue3'
import uploader from '../../packages/vue3/src/index'
console.log(uploader)

const app = createApp(App)

app.use(uploader)
app.mount('#app')