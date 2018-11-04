'use strict'

const transporter = require('./transporter')
const transporterStore = require('./transporterStore')

class sms {
    constructor (config) {
        this._config = config
        this._transporter = new transporter(config.connection.sms)
    }

    registerTransporter () {
        if (this._driver === 'nexmo') {
            this._transporter.plugin(require('./transporters/nexmo.js'))
        }
    }

    driver (driver) {
        this._driver = driver || 'smtp'
        this.registerTransporter()
        if (transporterStore.list()[this._driver]) {
            this.transporter = transporterStore.list()[this._driver]
        }
        return this
    }

    send (data) {
        return new Promise((resolve, reject) => {
            if (this.transporter) {
                this.transporter.send(data, () => {
                    resolve({ smsMessage: data })
                })
            } else {
                reject({ smsMessage: data, error: { message: 'Not Driver found!' } })
            }
        })
    }
}

module.exports = sms
