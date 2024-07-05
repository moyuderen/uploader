import uploader from './components/uploader.vue'

const Uploader = {
  install(app) {
    app.component('Uploader', uploader)
  }
}

export default Uploader

