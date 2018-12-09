const transporterStore = require('./transporterStore')

class transporter {
    constructor(config) {
        this._config = config
    }

    plugin(transport) {
        const newTransport = new transport(this._config)
        const pushNotificationTransport = {
            name: newTransport.name,
            send(message, callback) {
                newTransport.send(message, callback)
            }
        }
        transporterStore.add(newTransport.name, pushNotificationTransport)
        return this
    }
}

module.exports = transporter
