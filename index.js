'use strict'

const co = require('co')

class Notification  {

    constructor() {
        this.driver = 'rocketMailgun'
        this.showHtml = false
    }

    * send(notification) {
        const via = yield notification.via()
        if (via.indexOf('mail') > -1) {
            yield this.sendMail(notification)
        }
        if (via.indexOf('html') > -1) {
            return yield this.html(notification)
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
            const notificationResult = yield notification.toMail()
            const html = yield notificationResult.render()
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

    * html(notification) {
        const self = this
        const notificationResult = yield notification.toMail()
        const html = yield notificationResult.render({ inline: false })
        return html
    }

}

module.exports = Notification
