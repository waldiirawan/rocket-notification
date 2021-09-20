'use strict'

const chatMessage = require('../../src/chatMessage')

class testChatApiNotification {
    static get channel() {
        return 'testsendchatapi'
    }

    constructor(config, payload) {
        const { api } = config.connection.chat
        this._config = config
        this.payload = payload
        this._chatConfig = api
    }

    send(message, api) {
        return api.post(this._chatConfig.sendURLPath, { Apikey: this._chatConfig.apiKey, Phone: message.to, Message: message.text })
    }

    via() {
        return ['chat']
    }

    chatDriver() {
        return 'api'
    }

    toChat() {
        return new chatMessage()
            .to('xxxxxxxxxxxx')
            .text('Veryfication Code is 901111')
    }
}

module.exports = testChatApiNotification
