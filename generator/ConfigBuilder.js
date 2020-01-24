class ConfigBuilder {
  constructor(config) {
    this.files = []
    this.config = config
  }

  addFiles(files) {
    this.files.push.apply(this.files, files)
    return this
  }

  build() {
    // todo
    return this.config
  }

  write() {
    // todo
  }
}

module.exports = ConfigBuilder
