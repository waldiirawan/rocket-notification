'use strict'

const View = use('View')
const co = require('co')
const juice = require('juice')

class mailMessage {

    constructor() {
        this.lines = []
        this.mail = {
            from: { email : '', name : '' },
            to: { email : '', name : '' },
            cc: [],
            bcc: [],
            subject: ''
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

    greeting(greeting) {
        this.greeting = { type: 'greeting', value: greeting }
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

    nl2br(str, isXhtml) {
        var breakTag = isXhtml ? '<br />' : '<br>'
        return String(str).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
    }

    markdown(view) {
        const self = this
        this.lines.unshift(this.greeting)
        const lines = this.lines
        const promises = []
        lines.forEach( (item) => {
            promises.push(
                co(function *() {
                    const view = yield self[`${(item).type}View`]((item))
                    return yield Promise.resolve(view)
                })
            )
        })
        return co(function *() {
            const html = yield View.make(view, { slots: yield Promise.all(promises).then((values) => {
                return this.blah = values
            }), env: process.env })
            return yield Promise.resolve(juice(html))
        })
    }

    * greetingView(item) {
        return View.make('email.greeting', {
            greeting: this.nl2br(item.value)
        })
    }

    * lineView(item) {
        return View.make('email.line', {
            line: this.nl2br(item.value)
        })
    }

    * buttonView(item) {
        return View.make('email.button', {
            name: item.name,
            url: item.url,
            color: item.color
        })
    }


}

module.exports = mailMessage
