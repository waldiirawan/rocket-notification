'use strict'

const transporter = require('./transporter')
const transporterStore = require('./transporterStore')

class chat {
    constructor (config) {
        this._config = config
        this._transporterStore = transporterStore
        this._transporter = new transporter(config.connection.chat)
        for (let prop in config.connection.chat) {
            const appDriver = config.connection.chat[prop]
            if (appDriver.initApp) {
                this.registerTransporter(true)
            }
        }
    }

    registerTransporter (initApp = false) {
        if (initApp || this._driver === 'telegram') {
            this._transporter.plugin(require('./transporters/telegram.js'))
        }
    }

    driver (driver) {
        this._driver = driver || 'telegram'
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
                    resolve({ chatMessage: data })
                })
            } else {
                reject({ chatMessage: data, error: { message: 'Not Driver found!' } })
            }
        })
    }
}

module.exports = chat
