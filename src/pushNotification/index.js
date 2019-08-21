'use strict'

const transporter = require('./transporter')
const transporterStore = require('./transporterStore')

class pushNotification {
    constructor (config) {
        this._config = config
        this._transporterStore = transporterStore
        this._transporter = new transporter(config.connection.pushnotif)
        for (let prop in config.connection.pushnotif) {
            const appDriver = config.connection.pushnotif[prop]
            if (appDriver.initApp) {
                this.registerTransporter(true)
            }
        }
    }

    registerTransporter (initApp = false) {
        if (initApp || this._driver === 'firebase') {
            this._transporter.plugin(require('./transporters/firebase.js'))
        }
    }

    driver (driver) {
        this._driver = driver || 'firebase'
        this.registerTransporter()
        if (transporterStore.list()[this._driver]) {
            this.transporter = transporterStore.list()[this._driver]
        }
        return this
    }

    send (data) {
        return new Promise((resolve, reject) => {
            if (this.transporter) {
                this.transporter.send(data, (error, response) => {
                    if (error) {
                        reject({ pushNotificationMessage: data, error })
                    } else {
                        resolve({ pushNotificationMessage: data, response })
                    }
                })
            } else {
                reject({ pushNotificationMessage: data, error: { message: 'Not Driver found!' } })
            }
        })
    }
}

module.exports = pushNotification
