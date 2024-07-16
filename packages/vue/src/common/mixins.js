export const uploaderMixin = {
  inject: ['instance'],
  computed: {
    uploader() {
      return this.instance()
    }
  }
}
