const nodemailer = require('nodemailer')
const transporterStore = require('./transporterStore')

class transporter {
  plugin(transport, config) {
    const newTransport = new transport(config)
    const mailerTransport = {
      name: newTransport.name,
      send(message) {
        newTransport.send(message)
      }
    }
    transporterStore.add(newTransport.name, nodemailer.createTransport(mailerTransport))
    return this
  }

  smtp(name, config) {
    transporterStore.add(name, nodemailer.createTransport(config))
    return this
  }

  ses(name, aws, config) {
    const conf = config || { apiVersion: '2010-12-01' }
    transporterStore.add(name, nodemailer.createTransport({
      SES: new aws.SES(conf)
    }))
    return this
  }
}

module.exports = new transporter()
