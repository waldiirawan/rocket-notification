'use strict'

const transporter = require('./transporter')
const transporterStore = require('./transporterStore')
const aws = require('aws-sdk')

class mail {
    constructor (config) {
        this._config = config
        this._transporter = new transporter(config.connection.mail)
    }

    registerTransporter () {
        if (this._driver === 'mailgun') {
            this._transporter.plugin(require('./transporters/mailgun.js'))
        }
        this._transporter.smtp('smtp')
        this._transporter.ses('ses', aws)
    }

    driver (driver) {
        this._driver = driver || 'smtp'
        this.registerTransporter()
        if (transporterStore.list()[this._driver]) {
            this._transporter = transporterStore.list()[this._driver]
        }
        return this
    }

    send (data) {
        return new Promise((resolve, reject) => {
            this._transporter.sendMail(data, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        })
    }
}

module.exports = mail
