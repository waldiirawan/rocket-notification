'use strict'

const smsMessage = require('../../src/smsMessage')

class testSMSNotification {
    static get channel() {
        return 'test3'
    }

    constructor(config, payload) {
        this._config = config
        this.payload = payload
    }

    via() {
        return ['sms']
    }

    smsDriver() {
        return 'nexmo'
    }

    toSMS() {
        return new smsMessage()
            .from('VUEONE')
            .to('6281311383560')
            .text('Veryfication Code is 901111')
    }
}

module.exports = testSMSNotification
