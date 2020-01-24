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
  // todo call api
  return testConfig
}

/**
 * Fetch all the files for the given client from the given configuration
 */
function fetchFiles(credentials, configuration) {
  // todo
  return [new Promise(resolve => { resolve() })]
}

module.exports = {
  checkCredentials,
  fetchConfiguration,
  fetchFiles
}
