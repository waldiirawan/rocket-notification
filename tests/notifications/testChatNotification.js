'use strict'

const chatMessage = require('../../src/chatMessage')

class testChatNotification {
    static get channel() {
        return 'test5'
    }

    constructor(config, payload) {
        const { telegram } = config.connection.chat
        this._config = config
        this.payload = payload
        this._chatConfig = telegram
    }

    via() {
        return ['chat']
    }

    chatDriver() {
        return 'telegram'
    }

    toChat() {
        return new chatMessage()
            .from(this._chatConfig.botToken)
            .to(this._chatConfig.botSend)
            .text('Veryfication Code is 901111')
    }
}

module.exports = testChatNotification
