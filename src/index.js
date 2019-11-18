'use strict'
const mail = require('./mail')
const sms = require('./sms')
const pushNotification = require('./pushNotification')
const fs = require('fs')
const AsyncFunction = (async () => {}).constructor

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

    findChannel(channel) {
        return new Promise((resolve, reject) => {
            if (this.notifications[channel]) {
                resolve()
            } else {
                reject({ error: { name: 'NotFoundChannel', message: `No channel found for ${channel}!` } })
            }
        })
    }

    sendAction(channel, payload) {
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

    send(channels, payload = {}) {
        if (typeof channels === 'object' && channels instanceof Array) {
            const promises = []
            for (let i = 0; i < channels.length; i++) {
                const channel = channels[i]
                promises.push(this.findChannel(channel).then(() => {
                    return this.sendAction(channel, payload)
                }))
            }
            return Promise.all(promises)
        } else {
            return this.findChannel(channels).then(() => {
                return this.sendAction(channels, payload)
            })
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

    chunks(array, chunk_size) {
      return Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size))
    }

    sendPushNotificaton(notification) {
        const self = this
        if (typeof notification.pushNotificationDriver === 'function') {
            this._pushNotificationDriver = notification.pushNotificationDriver()
        }
        if (notification.toPushNotification instanceof AsyncFunction) {
            return notification.toPushNotification().then(notificationResult => {
                return notificationResult.render().then(({ isTargetChunkMultiple, targetChunkMultipleSize, pushNotificationMessage }) => {
                    if (isTargetChunkMultiple) {
                        const groupedTargets = this.chunks(pushNotificationMessage.target, targetChunkMultipleSize)
                        const promisesTargets = []
                        for (let i = 0; i < groupedTargets.length; i++) {
                          const targets = groupedTargets[i]
                          promisesTargets.push(self.pushNotification.driver(self._pushNotificationDriver).send({ ...pushNotificationMessage, target: targets }))
                        }
                        return Promise.all(promisesTargets)
                    }
                    return self.pushNotification.driver(self._pushNotificationDriver).send(pushNotificationMessage)
                })
            })
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
