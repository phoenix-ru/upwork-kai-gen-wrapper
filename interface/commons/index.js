/**
 * Messages corresponding to HTTP status codes
 */
const MESSAGES = {
  200: 'Success',
  401: 'Authentication required',
  403: 'Forbidden',
  404: 'Not found',
  500: 'Internal server error'
}

/*
 * Function definitions 
 */

/**
 * Respond with a given code (defaults to 200)
 * @param {{ json: function }} res The Response object
 * @param {*} data The data to be sent
 * @param {Number} code 
 */
function respond (res, data, code) {
  res.json({ code: code || 200, message: MESSAGES[code || 200], data })
}

module.exports = {
  MESSAGES,
  respond
}