'use strict'

class api {
    constructor(config) {
        this.config = config.api
        this.name = 'api'
        this.transport = this._createTransport(config.api)
    }

    _createTransport() {
        let configApi = {}
        if (this && this.config) {
            configApi = this.config
        }
        const Axios = require('axios')
        const api = Axios.create(configApi)
        return api
    }

    send(message, callback, context) {
        const api = this.transport
        return new Promise(function(resolve) {
            if (typeof context.send === 'function') {
                return context.send(message, api)
            } else {
                resolve()
            }
        })
    }
}

module.exports = api
