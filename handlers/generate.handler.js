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

  /* The configuration was fetched successfully, so supply the client with the token */
  respond(res, { token: credentials.token })

  /* Socket: TODO */
  // client must establish socket connection using secret he got and we will do other things through it
  // update the state for the current client
  const socket = {}
  const stage = 0 // todo wrap into some nice interface
  const notifyProgress = (socket, data) => {
    /* todo notify client (or use interface) */
    console.log(data)
  }

  /* Fetch the necessary files */
  let filePromises = API.fetchFiles(credentials, generatorConfiguration)

  /* Counter and total for watching the progress */
  let assetsCounter = 0
  const assetsTotal = filePromises.length

  /* Watch for the progress of assets */
  filePromises.forEach((promise) => {
    promise.then((res) => {
      if (res && res.error) {
        // notify about error
        return
      }

      notifyProgress(socket, {
        event: 'progress',
        stage,
        data: {
          count: ++assetsCounter,
          total: assetsTotal
        }
      })
    })
  })

  /* Prepare config */
  const configBuilder = new ConfigBuilder(generatorConfiguration)
  const assets = await Promise.all(filePromises)
  if (assets.some(el => el.error)) {
    // notify about error
    // stop execution
    return
  }

  /* Add client id */
  configBuilder.useClientId(credentials.token)

  /* Add assets */
  configBuilder.addAssets(assets)

  /* Build and write config */
  const builtConfig = configBuilder.build()
  await builtConfig.write()
  notifyProgress(socket, {
    event: 'progress',
    stage: 1
  })

  /* Setup environment variables */
  const envConvig = {
    TOKEN: credentials.token
  }

  /* Invoke generation */
  const npmInterface = new NPMInterface(builtConfig, envConvig)
  await npmInterface.runGenerate()

  /* Notify about success */
  // console.log('Generated from config', builtConfig)

  /* Clean up */
  console.log('Cleaning up')
}

module.exports = {
  handleGenerate
}
