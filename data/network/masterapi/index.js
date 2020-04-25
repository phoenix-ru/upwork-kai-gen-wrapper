const ServiceFactory = require('../services/service.factory')

function getDataOrError(res) {
  return res.error ? res : res.data
}

/**
 * Verifies credentials entered by a user.
 * Connects to the Master API and returns a token on success.
 * @param {*} credentials The credentials to check
 * @returns {Promise<{valid: Boolean, token?: string}>} An object with a `valid` flag and optional `token`.
 */
function verifyCredentials(credentials) {
  return ServiceFactory.getDefaultMasterApiService()
    .verifyCredentials(credentials)
    .then(getDataOrError)
}

/**
 * Fetches the configuration
 * @param {{token: string}} credentials The credentials for the Master API
 * @returns {Promise<({error: number}|{data})>}
 */
function fetchConfiguration(credentials) {
  return new ServiceFactory.MasterApiServiceBuilder()
    .withCredentials(credentials)
    .build()
    .fetchConfiguration()
    .then(getDataOrError)
}

/**
 * Fetches the assets from theme configuration
 * @param {*} credentials 
 * @param {*} configuration 
 * @returns {Array<Promise<({error:number}|{data})>>}
 */
function fetchAssets(credentials, configuration) {
  return new ServiceFactory.MasterApiServiceBuilder()
    .withCredentials(credentials)
    .withConfiguration(configuration)
    .build()
    .fetchAssets()
}

function sendArchive(credentials, data) {
  return new ServiceFactory.MasterApiServiceBuilder()
    .withCredentials(credentials)
    .build()
    .sendArchive(data)
}

module.exports = {
  verifyCredentials,
  fetchConfiguration,
  fetchAssets,
  sendArchive
}
