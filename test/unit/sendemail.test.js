const testNotification = require('../notifications/testNotification')
const Rocket = require('../../')
const co = require('co')

describe('Test rendering view', () => {
    it('should call generator function and return string', co.wrap(function *() {
        const html = yield Rocket.driver('rocketMailgun').send(new testNotification({  }))
        expect.stringContaining(html)
    }))
})
