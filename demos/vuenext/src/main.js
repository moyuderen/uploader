import { createApp } from 'vue'
import App from './App.vue'
import uploader from '@tinyuploader/vuenext'
import '@tinyuploader/vuenext/dist/style.css'

const app = createApp(App)

app.use(uploader)
app.mount('#app')
