require('dotenv').config()
const rocket = require('../../src/')
const Rocket = new rocket(`${__dirname}/../config/rocket.js`)

describe('Test rendering view', () => {
    it('should call generator function and return string', () => {
        Rocket.send('test3', { foo: 'bar' })
            .catch((error) => {
                console.error(error)
            })
    })
})
