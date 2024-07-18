import { createApp } from 'vue'
import App from './App.vue'
import uploader from '@tinyUploader/vuenext'
import '@tinyUploader/vuenext/dist/style.css'

const app = createApp(App)

app.use(uploader)
app.mount('#app')
