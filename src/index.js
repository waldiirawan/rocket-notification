'use strict'
const mail = require('./mail')
const sms = require('./sms')
const pushNotification = require('./pushNotification')
const fs = require('fs')

class Rocket {
    constructor(config) {
        if (typeof config === 'string') {
            this._config = Object.assign({}, require(config))
        } else {
            this._config = Object.assign({}, config)
        }
        this.result = {}
        const currentPath = this._config.notificationAppLocation + '/'
        this.notificationController(currentPath)
        this.notifications = this.result
        this.mail = new mail(this._config)
        this.sms = new sms(this._config)
        this.pushNotification = new pushNotification(this._config)
        return this
    }

    notificationController(currentPath) {
        const dir = fs.readdirSync(currentPath)
        for (let i = 0; i < dir.length; i++) {
            const output = dir[i]
            if (fs.lstatSync(currentPath + output).isDirectory()) {
                this.notificationController(`${currentPath}${output}/`)
            } else {
                const notification = require(currentPath + output)
                if (typeof notification.channel === 'string') {
                    this.result[notification.channel] = {
                        channel: notification.channel,
                        notification: notification
                    }
                }
            }
        }
    }

    send(channel, payload = {}) {
        const notification = new this.notifications[channel].notification(this._config, payload)
        const via = notification.via()
        if (via.indexOf('mail') > -1) {
            return this.sendMail(notification)
        }
        if (via.indexOf('sms') > -1) {
            return this.sendSMS(notification)
        }
        if (via.indexOf('pushNotification') > -1) {
            return this.sendPushNotificaton(notification)
        }
        if (via.indexOf('html') > -1) {
            return this.html(notification)
        }
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

    sendSMS(notification) {
        if (typeof notification.smsDriver === 'function') {
            this._smsDriver = notification.smsDriver()
        }
        const notificationResult = notification.toSMS()
        return notificationResult.render().then(({ smsMessage }) => {
            return this.sms.driver(this._smsDriver).send(smsMessage)
        })
    }

    sendPushNotificaton(notification) {
        if (typeof notification.pushNotificationDriver === 'function') {
            this._pushNotificationDriver = notification.pushNotificationDriver()
        }
        const notificationResult = notification.toPushNotification()
        return notificationResult.render().then(({ pushNotificationMessage }) => {
            return this.pushNotification.driver(this._pushNotificationDriver).send(pushNotificationMessage)
        })
    }

    html(notification) {
        const notificationResult = notification.toMail()
        return notificationResult.render({ inline: false })
    }
}

module.exports = Rocket
