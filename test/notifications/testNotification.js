'use strict'

const mailMessage = require('../../mailMessage')

class testNotification {

    constructor(payload) {
        this.payload = payload
    }

    * via()
    {
        return ['html']
    }

    * toMail() {
        return new mailMessage()
            .from('waldiirawan127@gmail.com', 'Waldi Irawan')
            .to('waldiirawan@gmail.com', 'Waldi Irawan')
            .subject(`Test Mail`)
            .greeting(`Hai :)`)
            .line('Test')
            .markdown('email.message')
    }
}

module.exports = testNotification
