import uploader from './uploader.vue'

const Uploader = {
  install(app) {
    app.component('Uploader', uploader)
  }
}

export default Uploader
