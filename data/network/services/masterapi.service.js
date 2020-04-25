const axios = require('axios')
const FormData = require('form-data')
const { get, post } = require('./abstract.service')

/* Base API endpoint */
const ENDPOINT = 'https://app.vorlon.tech/api/v1'

/* Helper functions */
const getAssets = (configuration) => configuration.themeassets
const getThemeRoot = (configuration) => configuration.meta.theme_root

/* Service class */
class Service {
  constructor() {
    this._credentials = undefined
  }

  credentials = {
    get() {
      return this._credentials
    },

    set(value) {
      this._credentials = Object.assign({}, value)

      return this
    }
  }

  configuration = {
    get() {
      return this._configuration
    },
    set(value) {
      this._configuration = Object.assign({}, value)
    }
  }

  /**
   * Verifies credentials on Master API
   * @param {*} credentials 
   */
  verifyCredentials(credentials) {
    // todo
    return new Promise(resolve => resolve({ data: { valid: true, token: credentials }}))
  }

  /**
   * Fetches the configuration from Master API
   */
  fetchConfiguration() {
    this._checkAndCreateClientIfNeeded()

    return get(
      this._httpClient,
      `${ENDPOINT}/deployments/${this.credentials.token}`,
      { credentials: this.credentials.token }
    )
  }

  /**
   * Fetches the asset from the specified URL
   * @param {String} path The path of the asset
   * @param {String} assetType The type of the asset
   */
  async fetchAsset(assetUrl, assetType) {
    /* Checks */
    const r = this._checkConfiguration()
    if (r) return r

    this._checkAndCreateClientIfNeeded(getThemeRoot(this.configuration))

    /* Call internal function */
    return this._fetchAsset(assetUrl, assetType)
  }

  /**
   * Fetches all the files for the given client from the given configuration
   * @param credentials {{token: string}} The credentials used to allow access to Master API
   * @param configuration {*} The generate configuration
   * @returns {Array<Promise>} An array of promises, each of which should resolve to {path: string, type: string, data: Binary}
   */
  fetchAssets() {
    /* Checks */
    const r = this._checkConfiguration()
    if (r) return r

    this._checkAndCreateClientIfNeeded(getThemeRoot(this.configuration))

    /* Add all promises to an array */
    const promises = []
    const assets = getAssets(this.configuration)
    for (const assetType of Object.keys(assets)) {
      for (const assetUrl of assets[assetType]) {
        promises.push(this.fetchAsset(assetUrl, assetType))
      }
    }

    return promises
  }

  sendArchive(data) {
    this._checkAndCreateClientIfNeeded()

    /* Create form data */
    const formData = new FormData()
    formData.append('upload', data)

    return post(
      this._httpClient,
      `${ENDPOINT}/deployments/${this.credentials.token}`,
      formData,
      { headers: formData.getHeaders() }
    )
  }

  async _fetchAsset(assetUrl, assetType) {
    const res = await get(this._httpClient, assetUrl, { credentials: this.credentials.token })
    if (res && res.error) return res

    return {
      path: assetUrl,
      type: assetType,
      data: res.data
    }
  }

  _checkConfiguration() {
    if (!this.configuration) {
      return { error: 'No configuration provided, aborting' }
    }
  }

  _checkAndCreateClientIfNeeded(baseURL) {
    if (!this._httpClient || this.__baseURL !== baseURL) {
      this._httpClient = axios.create({ baseURL })
      this.__baseURL = baseURL
    }
  }
}

module.exports = Service
