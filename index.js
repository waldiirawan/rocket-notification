'use strict'

const Mail = use('Mail')
const View = use('View')
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
            const html = []
            if (notificationResult instanceof Array) {
                for (let i = 0; i < notificationResult.length; i++) {
                    html.push(yield notificationResult[i].markdown('email.message'))
                }
            } else {
                html.push(yield notificationResult.markdown('email.message'))
            }
            const Email = yield Mail.driver(self.driver).raw('', (message) => {
                message.html(html.join())
                message.subject(notificationResult[0].mail.subject)
                message.from(notificationResult[0].mail.from.email, notificationResult[0].mail.from.name)
                message.to(notificationResult[0].mail.to.email, notificationResult[0].mail.to.name)
                notificationResult[0].mail.cc.forEach((item) => {
                    message.cc(item.email, item.name ? item.name : '')
                })
                notificationResult[0].mail.bcc.forEach((item) => {
                    message.bcc(item.email, item.name ? item.name : '')
                })
            })
        })
        return true
    }

    * html(notification) {
        const self = this
        const notificationResult = yield notification.toMail()
        const html = []
        if (notificationResult instanceof Array) {
            for (let i = 0; i < notificationResult.length; i++) {
                html.push(yield notificationResult[i].markdown('email.message', { inline: false }))
            }
        } else {
            html.push(yield notificationResult.markdown('email.message', { inline: false }))
        }
        return html.join()
    }

}

module.exports = Notification
