const path = require('path')
const fs = require('fs')

/**
 * Ensures that all the directories to a given file exist.
 * Creates them if needed
 * @param {String} filePath The path to the file
 */
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }

  fs.mkdirSync(dirname, { recursive: true })
}

/**
 * Writes file to the given path
 * @param {String} path The path where to write the file
 * @param {String} data The file contents
 */
function writeFile(path, data) {
  ensureDirectoryExists(path)

  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'utf8', (err) => {
      if (err) {
        reject(err)
      } else resolve()
    })
  })
}

/**
 * The built config ready to be inserted at project
 */
class Config {
  constructor(configBuilder) {
    /* Assign config */
    this.config = {
      data: configBuilder.config.data,
      theme: {
        name: configBuilder.config.meta.theme
      }
    }

    /* Assign environment variables */
    this.env = configBuilder.env

    /* Add and split assets */
    this._assets = {}
    for (const asset of configBuilder.assets) {
      /* No assets of this type were present */
      if (!this._assets[asset.type]) {
        this._assets[asset.type] = []
      }

      /* Add asset */
      this._assets[asset.type].push({
        path: asset.path,
        data: asset.data
      })
    }

    /* Configure css */
    this.config.theme.css = []
    for (const styleType of ['css', 'sass', 'scss']) {
      if (this._assets[styleType]) {
        this._assets[styleType].forEach(a => this.config.theme.css.push(a.path))
      }
    }
  }

  write(dir) {
    /* Array of all file promises */
    const allPromises = []

    /* File path for the build */
    const buildRoot = `${dir}/build`
    const buildFilesPath = `${buildRoot}/${this.config.clientId}`

    /* Write configuration */
    allPromises.push(writeFile(`${buildFilesPath}/config.json`, JSON.stringify(this.config)))

    /* Write all the assets */
    for (const assetType of Object.keys(this._assets)) {
      for (const asset of this._assets[assetType]) {
        allPromises.push(writeFile(`${buildFilesPath}/assets/${asset.path}`, asset.data))
      }
    }

    /* Compose .env config */
    let envString = ''
    const envKeys = Object.keys(this.env)
    if (this.env && envKeys.length) {
      envKeys.forEach(key => { envString += `${String(key)}=${String(this.env[key])}` })
    }

    /* Write .env */
    allPromises.push(writeFile(`${buildRoot}/.env`, envString))

    return Promise.all(allPromises)
  }
}

/**
 * The helper class for building the config
 */
class ConfigBuilder {
  constructor(config) {
    this.assets = []
    this.config = config
  }

  addAssets(assets) {
    this.assets.push.apply(this.assets, assets)
    return this
  }

  addEnv(env) {
    this.env = env
    return this
  }

  build() {
    return new Config(this)
  }
}

module.exports = ConfigBuilder
