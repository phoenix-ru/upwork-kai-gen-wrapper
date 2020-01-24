const API = require('../handlers/api.handler')
const ConfigBuilder = require('../generator/ConfigBuilder')
const NPMInterface = require('../generator/NpmInterface')
const { respond } = require('./commons')

async function handleGenerate(req, res) {
  /* Verify credentials */
  const credentials = await API.checkCredentials(req.query.credentials)
  if (!credentials.valid) {
    respond(res, null, 401)
    return
  }
  // todo push token to temporary storage (even in-memory should do it)

  /* Fetch the configuration */
  const generatorConfiguration = await API.fetchConfiguration(credentials)
  if (!generatorConfiguration || generatorConfiguration.error) {
    respond(res, 'Configuration not found', 404) // ?
    return
  }

  /* Fetch the necessary files */
  const filePromises = API.fetchFiles(credentials, generatorConfiguration)

  /* Supply client with the token */
  respond(res, { token: credentials.token })
  // todo after that, client must establish socket connection using secret he got and we will do other things through it
  // todo update the state for the current client

  /* Build and write config */
  const configBuilder = new ConfigBuilder(generatorConfiguration)
  configBuilder.addFiles(await Promise.all(filePromises))
  const builtConfig = configBuilder.build()
  configBuilder.write()

  /* Setup environment variables */
  const envConvig = {}

  /* Invoke generation */
  const npmInterface = new NPMInterface(builtConfig, envConvig)
  await npmInterface.runGenerate()

  /* Notify about success */
  console.log('Generated from config', builtConfig)

  /* Clean up */
  console.log('Cleaning up')
}

module.exports = {
  handleGenerate
}
