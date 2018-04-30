'use strict'
const mail = require('./mail')

class Rocket {
    constructor(config) {
        if (typeof config === 'string') {
            this._config = Object.assign({}, require(config))
        } else {
            this._config = Object.assign({}, config)
        }

        const fs = require('fs')
        const result = {}
        const currentPath = this._config.notificationAppLocation + '/'
        const dir = fs.readdirSync(currentPath)
        for (let i = 0; i < dir.length; i++) {
            const output = dir[i]
            const notification = require(currentPath + output)
            if (typeof notification.channel === 'string') {
                result[notification.channel] = {
                    channel: notification.channel,
                    notification: notification
                }
            }
        }
        this.notifications = result
        this.mail = new mail(this._config)
        return this
    }

    send(channel, payload = {}) {
        const notification = new this.notifications[channel].notification(this._config, payload)
        const via = notification.via()
        if (via.indexOf('mail') > -1) {
            return this.sendMail(notification)
        }
        return this.html(notification)
    }

    sendMail(notification) {
        if (typeof notification.mailDriver === 'function') {
            this._driver = notification.mailDriver()
        }
        const notificationResult = notification.toMail()
        return notificationResult.render().then(({ mailerMessage, html }) => {
            mailerMessage.html = html
            return this.mail.driver(this._driver).send(mailerMessage)
        })
    }

    html(notification) {
        const notificationResult = notification.toMail()
        return notificationResult.render({ inline: false })
    }
}

module.exports = Rocket
