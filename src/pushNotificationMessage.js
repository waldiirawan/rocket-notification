'use strict'

class pushNotificationMessage {
    constructor() {
        this._target = []
        this._topics = []
        this._notification_id = null
        this._targetChunkMultiple = false
        this._targetChunkMultipleSize = 10
        this._options = {}
        this.fcmPayload = {
            notification: {
                title: null,
                icon: null,
                body: null,
                color: 'blue',
                click_action: 'APPNAME',
                sound: 'default',
                show_in_foreground: 'true'
            },
            data: {
                json: JSON.stringify({
                    notification_id: null
                })
            }
        }
        return this
    }

    target(target) {
        if (typeof target === 'string') {
            this._target.push(target)
        } else if (Array.isArray(target)) {
            this._target = this._target.concat(target)
        }
        return this
    }

    targetChunkMultiple(isTargetChunkMultiple) {
        this._targetChunkMultiple = isTargetChunkMultiple
        return this
    }

    targetChunkMultipleSize(size) {
        this._targetChunkMultipleSize = size
        return this
    }

    toTopics(target) {
        if (typeof target === 'string') {
            this._topics.push(target)
        } else if (Array.isArray(target)) {
            this._topics = this._topics.concat(target)
        }
        return this
    }

    title(title) {
        this.fcmPayload.notification.title = title
        if (!this.fcmPayload.notification.title) {
            this.fcmPayload.notification.title = ''
        }
        return this
    }

    icon(icon) {
        this.fcmPayload.notification.icon = icon
        return this
    }

    body(body) {
        this.fcmPayload.notification.body = body
        if (!this.fcmPayload.notification.body) {
            this.fcmPayload.notification.body = ''
        }
        return this
    }

    color(color) {
        this.fcmPayload.notification.color = color
        return this
    }

    sound(sound) {
        this.fcmPayload.notification.sound = sound
        return this
    }

    androidChannelId(android_channel_id) {
        this.fcmPayload.notification.android_channel_id = android_channel_id
        return this
    }

    image(imageUrl) {
        this.fcmPayload.notification.image = imageUrl
        return this
    }

    showInForeground(show) {
        this.fcmPayload.notification.show_in_foreground = show
        return this
    }

    clickAction(clickAction) {
        this.fcmPayload.notification.click_action = clickAction
        return this
    }

    dataOnly(isDataOnly, putOnData = false) {
        if (isDataOnly) {
            if (putOnData) {
                this.fcmPayload.data.json = JSON.stringify(Object.assign(JSON.parse(this.fcmPayload.data.json), {
                    notification: this.fcmPayload.notification
                }))
            }
            delete this.fcmPayload.notification
        }
        return this
    }

    SetOptions(options) {
        if (options) {
            this._options = options
        }
        return this
    }

    SetNotificationId(NotificationId) {
        this._notification_id = NotificationId
        this.fcmPayload.data.json = JSON.stringify(Object.assign(JSON.parse(this.fcmPayload.data.json), {
            notification_id: NotificationId
        }))
        return this
    }

    payloadData(data) {
        this.fcmPayload.data.json = JSON.stringify(Object.assign(JSON.parse(this.fcmPayload.data.json), data))
        return this
    }

    render() {
        return new Promise((resolve) => {
            resolve({
                notificationType: 'pushNotification',
                isTargetChunkMultiple: this._targetChunkMultiple,
                targetChunkMultipleSize: this._targetChunkMultipleSize,
                pushNotificationMessage: {
                    target: this._target,
                    topics: this._topics,
                    options: this._options,
                    notification_id: this._notification_id,
                    fcmPayload: this.fcmPayload
                }
            })
        })
    }
}

module.exports = pushNotificationMessage
