'use strict'

class telegram {
    constructor(config) {
        this.config = config.telegram
        this.name = 'telegram'
        this.transport = this._createTransport(config.telegram)
    }

    _createTransport() {
        const Telegram = require('telegraf/telegram')
        return Telegram
    }

    send(message, callback) {
        const telegram = this.transport
        const transportTelegram = new telegram(message.from)
        return transportTelegram.sendMessage(message.to, message.text, {}).then(callback).catch(callback)
    }
}

module.exports = telegram
