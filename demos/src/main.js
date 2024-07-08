import { createApp } from 'vue'
import App from './App.vue'
import uploader from '@uploader/v3'
import '@uploader/v3/styles.css'

console.log(uploader)
const app = createApp(App)

app.use(uploader)
app.mount('#app')
