import { createApp } from 'vue'
import App from './App.vue'
import uploader from '@uploader/vue3'

const app = createApp(App)

app.use(uploader)
app.mount('#app')
