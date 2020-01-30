const axios = require('axios')
const testConfig = require('../test_config.json')

/**
 * Check credentials entered by user.
 * Connects to API and returns token on success
 * @param {*} credentials The credentials to check
 */
async function checkCredentials(credentials) {
  // todo
  console.log(credentials)
  return { valid: true, token: 'y892nga9348h9va' }
}

/**
 * Fetch the configuration from API using given client token
 * @param {*} credentials The credentials assigned to a client
 */
async function fetchConfiguration(credentials) {
  try {
    const res = await axios.get('https://app.vorlon.tech/api/v1/pages')
    return res.data
  } catch (e) {
    return { error: e }
  }
}

/**
 * Fetches the file from the specified URL
 * @param {{ get: Function }} http The HTTP client
 * @param {*} The credentials of the client
 * @param {String} path The path of the asset
 * @param {String} assetType The type of the asset
 */
async function fetchAsset(http, credentials, path, assetType) {
  try {
    const res = await http.get(path, { credentials })
    return {
      path,
      type: assetType,
      data: res.data
    }
  } catch (e) {
    console.error(e)
    return { error: e }
  }
}

/**
 * Fetch all the files for the given client from the given configuration
 */
function fetchFiles(credentials, configuration) {
  const httpClient = axios.create({ baseURL: configuration.meta.theme_root })

  /* Fetch all assets */
  const promises = []
  for (const assetType of Object.keys(configuration.themeassets)) {
    for (const assetUrl of configuration.themeassets[assetType]) {
      promises.push(fetchAsset(httpClient, credentials, assetUrl, assetType))
    }
  }

  return promises
}

module.exports = {
  checkCredentials,
  fetchConfiguration,
  fetchFiles
}
