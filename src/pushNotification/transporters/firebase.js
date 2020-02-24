'use strict'

const transporterStore = require('../transporterStore')

class firebase {
    constructor(config) {
        this.config = config.firebase
        this.name = 'firebase'
        if (!transporterStore.list()[this.name]) {
            this.transport = this._createTransport(config.firebase)
            return true
        } else {
            this.transport = transporterStore.list()[this.name].transport
        }
        return false
    }

    _createTransport(config) {
        const admin = require('firebase-admin')
        const serviceAccount = require(config.jsonFile)
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: config.databaseURL
        })
        return admin
    }

    send(message, callback) {
        if (message.fcmPayload.notification) {
            if (!message.fcmPayload.notification.click_action) {
                message.fcmPayload.notification.click_action = this.config.clickAction
            }
        }
        if (message.notification_id && (message.target.length > 1 || (message.target.length > 0 && message.topics.length > 0)) ) {
            callback({ message: 'notification_id not suported for multiple target!' }, null)
            return false
        }
        if (message.target.length > 0 && message.topics.length > 0) {
            callback({ message: 'cannot send to devices and topics at the same time!' }, null)
            return false
        }
        if (message.target.length < 1 && message.topics.length < 1) {
            callback({ message: 'no target or topics to send' }, null)
            return false
        }
        if (message.target.length > 0) {
            return this.transport.messaging().sendToDevice(message.target, message.fcmPayload, Object.assign(this.config.options, message.options))
                .then((response) => {
                    if (!response.failureCount) {
                        callback(null, response)
                    } else {
                        callback(null, response)
                    }
                }).catch((error) => {
                    callback(error, null)
                })
        }
        if (message.topics.length > 0) {
            return this.transport.messaging().sendToTopic(message.topics[0], message.fcmPayload, Object.assign(this.config.options, message.options))
                .then((response) => {
                    if (!response.failureCount) {
                        callback(null, response)
                    } else {
                        callback(null, response)
                    }
                }).catch((error) => {
                    callback(error, null)
                })
        }
    }
}

module.exports = firebase
