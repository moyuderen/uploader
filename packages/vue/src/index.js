import Uploader from './components/uploader.vue'

const uploader = {
  install(Vue, options = {}) {
    const { name } = options
    Vue.component(name || 'Uploader', Uploader)
  }
}

export default uploader
