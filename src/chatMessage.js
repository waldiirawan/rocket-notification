'use strict'

class chatMessage {
    constructor() {
        this._to = null
        this._from = null
        this._text = ''
        return this
    }

    from(address) {
        this._from = address
        return this
    }

    to(address) {
        this._to = address
        return this
    }

    text(text) {
        this._text = text
        return this
    }

    render() {
        return new Promise((resolve) => {
            resolve({
                notificationType: 'chat',
                chatMessage: {
                    to: this._to,
                    from: this._from,
                    text: this._text,
                }
            })
        })
    }
}

module.exports = chatMessage
