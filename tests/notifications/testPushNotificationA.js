'use strict'

const pushNotificationMessage = require('../../src/pushNotificationMessage')

class testPushNotification {
    static get channel() {
        return 'test4a'
    }

    constructor(config, payload) {
        this._config = config
        this.payload = payload
    }

    via() {
        return ['pushNotification']
    }

    pushNotificationDriver() {
        return 'firebase'
    }

    toPushNotification() {
        return new pushNotificationMessage()
            .target(['eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_p5lcVLaCGo10fNcH5QAhzl75_IA-B7P1JuKLUdx88d3gux9Kx7e1bqdsrT'])
            // .toTopics(['TEST', '1111'])
            .title('VUEONE')
            .icon('icontest')
            .body('Veryfication Code is 901111')
            .color('blue')
            .SetNotificationId(1111)
            .payloadData({
                foo: 'bar'
            })
    }
}

module.exports = testPushNotification
