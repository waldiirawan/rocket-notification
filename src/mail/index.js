'use strict'

const transporter = require('./transporter')
const transporterStore = require('./transporterStore')
const aws = require('aws-sdk')

class mail {
  constructor(config) {
    transporter.plugin(require('./transporters/mailgun.js'), config)
    transporter.smtp('smtp', config.smtp)
    transporter.ses('ses', aws)
  }

  driver(driver) {
    this._driver = driver
    if (transporterStore.list()[this._driver]) {
      this._transporter = transporterStore.list()[this._driver]
    }
    return this
  }

  send(data) {
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
