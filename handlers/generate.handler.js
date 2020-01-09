const Builder = require('../generator/Builder')
const NPMInterface = require('../generator/NpmInterface')

module.exports = class Generator {
  constructor(config) {
    this.config = config
  }

  config = {
    get() {
      return this._builtConfig
    },
    set(value) {
      // todo build config
      this._builtConfig = value
    }
  }

  generate() {
    if (!this.config) {
      throw new Error('Please, specify config before generating')
    }

    // write config?

    /* Invoke generation */
    const npmInterface = new NPMInterface()
    npmInterface.runGenerate()

    /* Notify about success */
    // todo return value
    console.log('generated from config', this.config)
  }

  cleanup() {
    // todo
    console.log('cleaning up')
  }
}
