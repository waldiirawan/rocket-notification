'use strict'

const pushNotificationMessage = require('../../src/pushNotificationMessage')

class testPushNotification {
    static get channel() {
        return 'test4'
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

    async toPushNotification() {
        return new pushNotificationMessage()
            .targetChunkMultiple(false)
            .targetChunkMultipleSize(4)
            .target([
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_A1',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_A2',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_A3',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_A4',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_A5',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_B1',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_B2',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_B3',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_B4',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_B5',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_C1',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_C2',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_C3',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_C4',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_C5',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_D1',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_D2',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_D3',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_D4',
                'eOTzHNs0WG8:APA91bF_x0_1_PvKfx66TVzMZ2Skh050ZiqaEpeF9Xs47xxbTiUJoyWrJ0zvOUdVrLlOrB6hI8Ck-e257_D5'
            ])
            // .toTopics(['TEST', '1111'])
            .title('VUEONE')
            .icon('icontest')
            .body('Veryfication Code is 901111')
            .androidChannelId('privoApp')
            .image('https://dadada')
            .color('purple')
            // .SetNotificationId(1111)
            .payloadData({
                foo: 'bar'
            })
    }
}

module.exports = testPushNotification
