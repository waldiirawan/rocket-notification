'use strict'

class pushNotificationMessage {
    constructor() {
        this._target = []
        this._topics = []
        this._notification_id = null
        this.fcmPayload = {
            notification: {
                title: null,
                icon: null,
                body: null,
                color: 'blue',
                click_action: 'APPNAME',
                sound: 'default',
                show_in_foreground: 'true',
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
        return this
    }

    icon(icon) {
        this.fcmPayload.notification.icon = icon
        return this
    }

    body(body) {
        this.fcmPayload.notification.body = body
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

    showInForeground(show) {
        this.fcmPayload.notification.show_in_foreground = show
        return this
    }

    clickAction(clickAction) {
        this.fcmPayload.notification.click_action = clickAction
        return this
    }

    dataOnly(isDataOnly) {
        if (isDataOnly) {
            delete this.fcmPayload.notification
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
                pushNotificationMessage: {
                    target: this._target,
                    topics: this._topics,
                    notification_id: this._notification_id,
                    fcmPayload: this.fcmPayload
                }
            })
        })
    }
}

module.exports = pushNotificationMessage
