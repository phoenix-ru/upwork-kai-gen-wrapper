/**
 * Abstract service implementation for Axios
 * @author phoenix_ru
 * Revision from 29.12.2019
 */

const errors = require('../../../domain/errors')

function errorByStatus(status) {
  switch (status) {
    case 400: return errors.BAD_REQUEST
    case 401: return errors.AUTHENTICATION_REQUIRED
    case 403: return errors.ACCESS_FORBIDDEN
    case 404: return errors.NOT_FOUND
    case 412: return errors.PRECONDITION_FAILED
    case 500: return errors.INTERNAL_SERVER_ERROR
    default: return errors.UNKNOWN_ERROR
  }
}

function wrap(f) {
  return f()
    .catch((e) => {
      let error = errors.NETWORK_UNAVAILABLE
      if (e.response) error = errorByStatus(e.response.status)
      return { error }
    })
}

const get = (http, url, params) => wrap(() => {
  return http.get(url, { params })
})

const post = (http, url, data, config, urlAppend) => wrap(() => {
  return http.post(urlAppend ? url + urlAppend : url, data, config)
})

const put = (http, url, data, config, urlAppend) => wrap(() => {
  return http.put(urlAppend ? url + urlAppend : url, data, config)
})

const _delete = (http, url, data, config, urlAppend) => wrap(() => {
  return http.delete(urlAppend ? url + urlAppend : url, { data, ...config })
})

module.exports = {
  errorByStatus,
  wrap,
  get,
  post,
  put,
  delete: _delete
}
