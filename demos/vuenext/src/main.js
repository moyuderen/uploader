import { createApp } from 'vue'
import App from './App.vue'
import uploader from '@tiny-uploader/vuenext'
import '@tiny-uploader/vuenext/dist/style.css'

const app = createApp(App)

app.use(uploader)
app.mount('#app')
