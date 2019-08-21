require('dotenv').config()
const rocket = require('../../src/')
const Rocket = new rocket(`${__dirname}/../config/rocket.js`)

describe('Test rendering view', () => {
    it('should call generator function and return object', () => {
        expect.objectContaining(Rocket.pushNotification._transporterStore.list('firebase'))
    })
})
