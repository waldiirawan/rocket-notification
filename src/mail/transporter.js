const nodemailer = require('nodemailer')
const transporterStore = require('./transporterStore')

class transporter {
    constructor(config) {
        this._config = config
    }

    plugin(transport) {
        const newTransport = new transport(this._config)
        const mailerTransport = {
            name: newTransport.name,
            send(message) {
                newTransport.send(message)
            }
        }
        transporterStore.add(newTransport.name, nodemailer.createTransport(mailerTransport))
        return this
    }

    smtp(name) {
        transporterStore.add(name, nodemailer.createTransport(this._config.smtp))
        return this
    }

    ses(name, aws) {
        const conf = this._config || { apiVersion: '2010-12-01' }
        transporterStore.add(name, nodemailer.createTransport({
            SES: new aws.SES(conf)
        }))
        return this
    }
}

module.exports = transporter
