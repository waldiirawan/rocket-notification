'use strict'

const mailMessage = require('../../src/mailMessage')

class testNotification {
    static get channel() {
        return 'test2'
    }

    constructor(config, payload) {
        this._config = config
        this.payload = payload
    }

    via() {
        return ['mail']
    }

    mailDriver() {
        return 'smtp'
    }

    toMail() {
        return new mailMessage(this._config)
            .from(process.env.FROM_ADDRESS, process.env.FROM_NAME)
            .to(process.env.TO_ADDRESS, process.env.TO_NAME)
            .subject('Test Mail')
            .greeting('Hai :)')
            .line('Test')
            .markdown('email.message')
            .button('CLICK HERE', 'http://example.com')
    }
}

module.exports = testNotification
