import { createApp } from 'vue'
import App from './App.vue'
import Uploader from '@tinyuploader/vuenext'
import '@tinyuploader/vuenext/dist/style.css'

const app = createApp(App)

app.use(Uploader)
app.mount('#app')
