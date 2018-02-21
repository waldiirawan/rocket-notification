'use strict'
const mail = require('./mail')

class Rocket {
  constructor(config) {
    this._config = Object.assign({}, config)
    this._driver = 'smtp' // this is the default driver
    this._showHtml = false
    this.mail = new mail(this._config)
    return this
  }

  driver(driver) {
    this._driver = driver
    return this
  }

  send(notification) {
    const via = notification.via()
    if (via.indexOf('mail') > -1) {
      return this.sendMail(notification)
    }
    return this.html(notification)
  }

  sendMail(notification) {
    if (typeof notification.mailDriver === 'function') {
      this._driver = notification.mailDriver()
    }
    const notificationResult = notification.toMail()
    return notificationResult.render().then(({ mailerMessage, html }) => {
      mailerMessage.html = html
      return this.mail.driver(this._driver).send(mailerMessage)
    })
  }

  html(notification) {
    const notificationResult = notification.toMail()
    return notificationResult.render({ inline: false })
  }
}

module.exports = Rocket
