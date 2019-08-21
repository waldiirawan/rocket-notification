'use strict'

const transporter = require('./transporter')
const transporterStore = require('./transporterStore')

class sms {
    constructor (config) {
        this._config = config
        this._transporterStore = transporterStore
        this._transporter = new transporter(config.connection.sms)
        for (let prop in config.connection.sms) {
            const appDriver = config.connection.sms[prop]
            if (appDriver.initApp) {
                this.registerTransporter(true)
            }
        }
    }

    registerTransporter (initApp = false) {
        if (initApp || this._driver === 'nexmo') {
            this._transporter.plugin(require('./transporters/nexmo.js'))
        }
    }

    driver (driver) {
        this._driver = driver || 'nexmo'
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
