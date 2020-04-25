const { respond } = require('../commons')

/**
 * Handle basic ping requests to the server
 * @param {*} req 
 * @param {*} res 
 */
function handlePing(req, res) {
  respond(res, 'Application works, great!')
}

module.exports = {
  handlePing
}
