'use strict'

class nexmo {
    constructor(config) {
        this.config = config.nexmo
        this.name = 'nexmo'
        this.transport = this._createTransport(config.nexmo)
    }

    _createTransport(config) {
        const Nexmo = require('nexmo')
        if (!config.applicationId) {
            delete config.applicationId
        }
        if (!config.privateKey) {
            delete config.privateKey
        }
        return new Nexmo(config, {})
    }

    send(message, callback) {
        return this.transport.message.sendSms(message.from, message.to, message.text, {}, callback)
    }
}

module.exports = nexmo
