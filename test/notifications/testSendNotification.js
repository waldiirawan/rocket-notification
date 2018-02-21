'use strict'

const mailMessage = require('../../src/mailMessage')

class testNotification {
  constructor(payload) {
    this.payload = payload
  }

  via() {
    return ['mail']
  }

  mailDriver() {
    return 'mailgun'
  }

  toMail() {
    return new mailMessage()
      .from(process.env.FROM_ADDRESS, process.env.FROM_NAME)
      .to(process.env.TO_ADDRESS, process.env.TO_NAME)
      .subject('Test Mail')
      .greeting('Hai :)')
      .line('Test')
      .markdown('email.message')
      .button('CLICK HERE', 'http://example.com')
  }
}

module.exports = testNotification
