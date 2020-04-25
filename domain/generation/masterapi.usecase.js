const fs = require('fs')
const Archiver = require('../workers/ZipCompress.worker')
const NPMInterface = require('../workers/NpmInterface.worker')
const ConfigBuilder = require('../configuration/ConfigBuilder')


/* Define cwd for the app */
const APP_CWD = '../nuxt-app'

/**
 * Handles the generation
 * @param {MasterApi} MasterApi 
 * @param {*} data 
 * @param {*} error 
 * @param {*} success 
 * @param {*} notify 
 */
async function handleGenerate(MasterApi, data, notify) {
  /* Verify credentials */
  const credentials = await MasterApi.verifyCredentials(data.credentials)
  if (!credentials.valid) {
    notify.error('Invalid credentials', 401)
    return
  }

  /* Get the build token */
  const buildToken = credentials.token
  if (!buildToken) {
    notify.error('Master API returned an empty token', 403)
    return
  }

  /* Fetch the configuration */
  let generatorConfiguration = await MasterApi.fetchConfiguration(credentials)
  if (!generatorConfiguration || generatorConfiguration.error) {
    notify.error('Configuration not found', 404)
    return
  }

  /* The configuration was fetched successfully, so supply the client with the token */
  notify.success({ buildToken })

  /* Use state and notifications */
  let stage = 0
  const _notify = (data) => notify.progress(buildToken, { stage, ...data })
  _notify({ event: 'start' })

  /* Fetch the necessary files */
  let filePromises = MasterApi.fetchAssets(credentials, generatorConfiguration)

  /* Update the state */
  stage++
  _notify({ event: 'progress' })

  /* Counter and total for watching the progress */
  let assetsCounter = 0
  const assetsTotal = filePromises.length

  /* Watch for the progress of assets */
  filePromises.forEach((promise) => {
    promise.then((res) => {
      if (res && res.error) {
        _notify({ event: 'error', error: res.error })
        return res
      }

      _notify({
        event: 'progress',
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
    return
  }

  /* Add env */
  configBuilder.addEnv({
    CLIENT_ID: buildToken
  })

  /* Add assets */
  configBuilder.addAssets(assets)

  /* Build and write config */
  const builtConfig = configBuilder.build()
  await builtConfig.write(APP_CWD)

  /* Update state and notify */
  stage++
  _notify({ event: 'progress' })

  /* Invoke generation */
  const npmInterface = new NPMInterface(APP_CWD)
  await npmInterface.runGenerate()

  /* Update state */
  stage++
  _notify({ event: 'progress' })

  /* Prepare for zipping */
  const archiveName = `${__dirname}/${buildToken}.zip`

  /* Zip the generated folder */
  await new Archiver()
    .addDirectory(`${APP_CWD}/dist/${buildToken}`)
    .onError(console.error)
    .onWarning(console.warn)
    .pipe(fs.createWriteStream(archiveName))
    .compress()

  /* Update state */
  stage++
  _notify({ event: 'progress' })

  /* Send the archive */
  await MasterApi.sendArchive(credentials, fs.createReadStream(archiveName))

  /* Notify about success */
  stage++
  _notify({ event: 'done' })

  /* Clean up */
  console.log('Cleaning up...')
  fs.unlink(archiveName, () => console.log('Cleanup complete'))
}

module.exports = {
  handleGenerate,
  APP_CWD
}
