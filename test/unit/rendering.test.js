require('dotenv').config()
const testNotification = require('../notifications/testNotification')
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
    Rocket.driver('mailgun').send(new testNotification({ }))
      .then((result) => {
        expect.stringContaining(result.html)
      })
      .catch((error) => {
        console.error(error)
      })
  })
})
