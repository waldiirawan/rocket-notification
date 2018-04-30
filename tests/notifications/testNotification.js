'use strict'

const mailMessage = require('../../src/mailMessage')

class testNotification {
    static get channel() {
        return 'test1'
    }

    constructor(config, payload) {
        this._config = config
        this.payload = payload
    }

    via() {
        return ['html']
    }

    toMail() {
        return new mailMessage(this._config)
            .from(process.env.FROM_ADDRESS, process.env.FROM_NAME)
            .to(process.env.TO_ADDRESS, process.env.TO_NAME)
            .subject('Test Mail')
            .greeting('Hai :)')
            .line('Test')
            .markdown('email.message')
    }
}

module.exports = testNotification
