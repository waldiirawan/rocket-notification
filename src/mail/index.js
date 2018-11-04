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
            this.transporter = transporterStore.list()[this._driver]
        }
        return this
    }

    send (data) {
        return new Promise((resolve, reject) => {
            if (this.transporter) {
                this.transporter.sendMail(data, (error, response) => {
                    if (error) {
                        reject({ mailerMessage: data, error })
                    } else {
                        resolve({ mailerMessage: data, response })
                    }
                })
            } else {
                reject({ mailerMessage: data, error: { message: 'Not Driver found!' } })
            }
        })
    }
}

module.exports = mail
