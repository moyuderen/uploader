import Uploader from './components/Uploader.vue'

const uploader = {
  install(app) {
    app.component('Uploader', Uploader)
  }
}

export default uploader

