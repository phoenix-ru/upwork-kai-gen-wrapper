const archiver = require('archiver')

class Archiver {
  constructor() {
    this.archive = archiver('zip', { zlib: { level: 9 }})
    this.successListeners = []
    this.warningListeners = []
    this.errorListeners = []
  }

  addDirectory(path) {
    this.archive.directory(path, false)
    return this
  }

  pipe(to) {
    this.archive.pipe(to)
    return this
  }

  onSuccess(callback) {
    this.successListeners.push(callback)
    return this
  }

  onWarning(callback) {
    this.warningListeners.push(callback)
    return this
  }

  onError(callback) {
    this.errorListeners.push(callback)
    return this
  }

  async compress() {
    this.archive.on('error', (e) => {
      this.errorListeners.forEach(l => l(e))
    })

    this.archive.on('warning', (w) => {
      this.warningListeners.forEach(l => l(w))
    })

    await this.archive.finalize()
    this.successListeners.forEach(l => l(v))

    return true
  }
}

module.exports = Archiver
