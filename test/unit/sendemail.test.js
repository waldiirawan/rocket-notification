require('dotenv').config()
const testSendNotification = require('../notifications/testSendNotification')
const rocket = require('../../src/')
const Rocket = new rocket({
  mailgun: {
    apiKey: process.env.MAILGUN_APIKEY,
    domain: process.env.MAILGUN_DOMAIN
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  }
})

describe('Test rendering view', () => {
  it('should call generator function and return string', () => {
    Rocket.driver('mailgun').send(new testSendNotification({ }))
      .then((result) => {
        expect.objectContaining(result)
      }).catch((error) => {
        console.error(error)
      })
  })
})
