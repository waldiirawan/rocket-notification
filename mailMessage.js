'use strict'

const view = require('./view')
const co = require('co')
const juice = require('juice')

class mailMessage {

    constructor(options = {}) {
        this.lines = []
        this.customLines = []
        this.markdownMessage = 'email'
        this.baseMarkdown = ''
        this.mail = {
            from: { email : '', name : '' },
            to: { email : '', name : '' },
            cc: [],
            bcc: [],
            subject: '',
            data: {}
        }
        return this
    }

    from(email, name) {
        this.mail.from = { email : email, name : name }
        return this
    }

    subject(subject) {
        this.mail.subject = subject
        return this
    }

    to(email, name) {
        this.mail.to = { email : email, name : name }
        return this
    }

    cc(email, name) {
        this.mail.cc.push({ email : email, name : name })
        return this
    }

    bcc(email, name) {
        this.mail.bcc.push({ email : email, name : name })
        return this
    }

    data(data) {
        this.data = data
        return this
    }

    greeting(greeting) {
        // this.greeting = { type: 'greeting', value: greeting }
        this.lines.push({ type: 'greeting', value: greeting })
        return this
    }

    line(line) {
        this.lines.push({ type: 'line', value: line })
        return this
    }

    button(name, url = 'http://', color = 'blue') {
        this.lines.push({ type: 'button', name: name, url: url, color: color })
        return this
    }

    customLine(name, line) {
        this.lines.push({ type : 'custom', view: name, value: line })
        return this
    }

    nl2br(str, isXhtml) {
        var breakTag = isXhtml ? '<br />' : '<br>'
        return String(str).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
    }

    markdown(view, option = {}) {
        this.baseMarkdown = view.split('.')
        this.markdownMessage = this.baseMarkdown.join('/')
        this.baseMarkdown.pop()
        this.baseMarkdown = this.baseMarkdown.join('/')
        return this
    }

    render(option = { inline: true }) {
        const self = this
        const lines = this.lines
        const promises = []
        lines.forEach( (item) => {
            promises.push(
                co(function *() {
                    const view = yield self[`${(item).type}View`]((item))
                    return yield Promise.resolve(self.markdownMessage)
                })
            )
        })
        return co(function *() {
            const html = view.render(self.markdownMessage, { slots: yield Promise.all(promises).then((values) => {
                return this.blah = values
            }), env: process.env, subject: self.mail.subject, data: self.data })
            if (option.inline) {
                return juice(html)
            }
            return html
        })
    }

    * greetingView(item) {
        return view.render(`${this.baseMarkdown}.greeting`, {
            greeting: this.nl2br(item.value)
        })
    }

    * lineView(item) {
        return view.render(`${this.baseMarkdown}.line`, {
            line: this.nl2br(item.value)
        })
    }

    * customView(item) {
        return view.render(`${this.baseMarkdown}.${item.view}`, {
            line: this.nl2br(item.value)
        })
    }

    * customView(item) {
        return View.make(`email.${item.view}`, {
            line: this.nl2br(item.value)
        })
    }

    * buttonView(item) {
        return view.render(`${this.baseMarkdown}.button`, {
            name: item.name,
            url: item.url,
            color: item.color
        })
    }


}

module.exports = mailMessage
