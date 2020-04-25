const MasterApiService = require('./masterapi.service')

class MasterApiServiceBuilder {
  constructor() {
    this._service = new MasterApiService()
  }

  withCredentials(credentials) {
    if (!this._service.credentials && !credentials) {
      console.warn('Empty credentials provided to Master API service builder')
    }

    this._service.credentials = credentials

    return this
  }

  withConfiguration(configuration) {
    if (!configuration) {
      console.warn('Empty configuration provided to Master API service builder')
    }

    this._service.configuration = configuration

    return this
  }

  build() {
    return this._service
  }
}

class ServiceFactory {
  static MasterApiServiceBuilder = MasterApiServiceBuilder
  static _defaultMasterApiService = undefined

  /**
   * Get the singleton instance of Master Api service
   * @static
   * @returns {MasterApiService}
   */
  static getDefaultMasterApiService() {
    if (!this._defaultMasterApiService) {
      this._defaultMasterApiService = new MasterApiServiceBuilder().build()
    }

    return this._defaultMasterApiService
  }
}

module.exports = ServiceFactory
