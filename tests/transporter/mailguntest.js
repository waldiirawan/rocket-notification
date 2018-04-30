'use strict'

const mailgun = require('mailgun')

class mailguntest {
    constructor(config) {
        this.config = config
        this.transport = this._createTransport(config)
    }

    _createTransport(config) {
        return require('mailgun-js')(config)
    }

    send(message, callback) {
        return mailgun.messages().send(message, callback)
    }
}

module.exports = mailguntest
