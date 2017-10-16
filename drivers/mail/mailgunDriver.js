'use strict'

class mailgunDriver {

    constructor (Config) {
        this.config = Config
        this.transport = this._createTransport('mail.rocket.mailgun')
    }

  _createTransport (configKey) {
      const options = this.config.get(configKey)
      const mailgun = require('mailgun-js')(options)
      return mailgun
  }

  send (message, configKey) {
      const transport = configKey ? this._createTransport(configKey) : this.transport
      return transport.messages().send(message)
  }

}

module.exports = mailgunDriver
