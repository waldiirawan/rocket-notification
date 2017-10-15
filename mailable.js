'use strict'

class mailable {

    constructor(payload) {
        this.protocol = 'email'
        this.payload = payload
        return this
    }

}

module.exports = mailable
