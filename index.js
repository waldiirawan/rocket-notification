'use strict'

const Mail = use('Mail')
const View = use('View')
const co = require('co')

class Notification  {

    constructor() {
        this.driver = 'rocketMailgun'
    }

    * send(notification) {
        if (notification.protocol === 'email') {
            yield this.sendMail(notification)
        }
    }

    static driver(driver) {
        const self = new Notification()
        self.driver = driver
        return self
    }

    * sendMail(notification) {
        const self = this
        co(function *() {
            const notificationResult = yield notification.build()
            const html = yield notificationResult.markdown('email.message')
            const Email = yield Mail.driver(self.driver).raw('', (message) => {
                message.html(html)
                message.subject(notificationResult.mail.subject)
                message.from(notificationResult.mail.from.email, notificationResult.mail.from.name)
                message.to(notificationResult.mail.to.email, notificationResult.mail.to.name)
                notificationResult.mail.cc.forEach((item) => {
                    message.cc(item.email, item.name ? item.name : '')
                })
                notificationResult.mail.bcc.forEach((item) => {
                    message.bcc(item.email, item.name ? item.name : '')
                })
            })
        })
        return true
    }

}

module.exports = Notification
