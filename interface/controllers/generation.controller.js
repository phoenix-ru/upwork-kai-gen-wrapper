const MasterApi = require('../../data/network/masterapi')
const { respond } = require('../commons')
const { handleGenerate } = require('../../domain/generation/masterapi.usecase')

/**
 * Handle generation request
 * @param {*} req 
 * @param {*} res 
 */
function handleGeneration(req, res) {
  /* Extract user data */
  const userData = {
    credentials: (req.query && req.query.deployment) || (req.body && req.body.deployment)
  }

  /* Prepare functions */
  const notify = {
    progress: (token, data) => console.log(data), // todo use sockets, save randomly generated token
    success: data => respond(res, data),
    error: (cause, code) => respond(res, { cause }, code)
  }

  /* Call */
  handleGenerate(
    MasterApi,
    userData,
    notify
  )
}

module.exports = {
  handleGeneration
}