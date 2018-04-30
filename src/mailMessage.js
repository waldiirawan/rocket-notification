'use strict'

const view = require('./view')
const juice = require('juice')

class mailMessage {
    constructor(config) {
        this._lines = []
        this._customLines = []
        this._markdownMessage = 'email'
        this._baseMarkdown = ''
        this._mailerMessage = {
            subject: ''
        }
        this._data = {}
        this.view = new view(config)
        return this
    }

    setAddress(key, address, name) {
        this._mailerMessage[key] = this._mailerMessage[key] || []

        if (address instanceof Array === true) {
            this._mailerMessage[key] = this._mailerMessage[key].concat(address)
            return
        }

        const addressObj = name ? { name, address } : address
        this._mailerMessage[key].push(addressObj)
    }

    from(address, name) {
        this.setAddress('from', address, name)
        return this
    }

    sender(address, name) {
        this.setAddress('sender', address, name)
        return this
    }

    to(address, name) {
        this.setAddress('to', address, name)
        return this
    }

    cc(address, name) {
        this.setAddress('cc', address, name)
        return this
    }

    bcc(address, name) {
        this.setAddress('bcc', address, name)
        return this
    }

    replyTo(address, name) {
        this.setAddress('replyTo', address, name)
        return this
    }

    subject(subject) {
        this._mailerMessage.subject = subject
        return this
    }

    text(text) {
        this._mailerMessage.text = text
        return this
    }

    data(data) {
        this._data = data
        return this
    }

    greeting(greeting) {
        this._lines.push({ type: 'greeting', value: greeting })
        return this
    }

    line(line) {
        this._lines.push({ type: 'line', value: line })
        return this
    }

    button(name, url = 'http://', color = 'blue') {
        this._lines.push({ type: 'button', name: name, url: url, color: color })
        return this
    }

    customLine(name, line) {
        this._lines.push({ type: 'custom', view: name, value: line })
        return this
    }

    nl2br(str, isXhtml) {
        const breakTag = isXhtml ? '<br />' : '<br>'
        return String(str).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
    }

    markdown(viewName) {
        this._baseMarkdown = viewName.split('.')
        this._markdownMessage = this._baseMarkdown.join('/')
        this._baseMarkdown.pop()
        this._baseMarkdown = this._baseMarkdown.join('/')
        return this
    }

    render(option = { inline: true }) {
        const lines = []
        for (let i = 0; i < this._lines.length; i++) {
            lines.push(this[`${(this._lines[i]).type}View`]((this._lines[i])))
        }
        return new Promise((resolve) => {
            const html = this.view.render(this._markdownMessage, { slots: lines, env: process.env, subject: this._mailerMessage.subject, data: this._data })
            if (option.inline) {
                resolve({ mailerMessage: this.toJSON(), html: juice(html) })
            } else {
                resolve({ mailerMessage: this.toJSON(), html: html })
            }
        })
    }

    greetingView(item) {
        return this.view.render(`${this._baseMarkdown}.greeting`, {
            greeting: this.nl2br(item.value)
        })
    }

    lineView(item) {
        return this.view.render(`${this._baseMarkdown}.line`, {
            line: this.nl2br(item.value)
        })
    }

    customView(item) {
        return this.view.render(`${this._baseMarkdown}.${item.view}`, {
            line: this.nl2br(item.value)
        })
    }

    buttonView(item) {
        return this.view.render(`${this._baseMarkdown}.button`, {
            name: item.name,
            url: item.url,
            color: item.color
        })
    }

    toJSON() {
        this._mailerMessage.from = this.getRecipient(this._mailerMessage.from)
        this._mailerMessage.to = this.getRecipient(this._mailerMessage.to)
        if (this._mailerMessage.cc) {
            this._mailerMessage.cc = this.getRecipient(this._mailerMessage.cc)
        }
        if (this._mailerMessage.bcc) {
            this._mailerMessage.bcc = this.getRecipient(this._mailerMessage.bcc)
        }
        return this._mailerMessage
    }

    _getRecipient(recipient) {
        const { address, name } = typeof (recipient) === 'string' ? { address: recipient } : recipient
        return name ? `${name} <${address}>` : address
    }

    getRecipient(data) {
        let recipients = []
        recipients = recipients.concat((data || []).map(this._getRecipient.bind(this)))
        return recipients.join(',')
    }
}

module.exports = mailMessage
