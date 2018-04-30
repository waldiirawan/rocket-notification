require('dotenv').config()
const rocket = require('../../src/')
const Rocket = new rocket(`${__dirname}/../config/rocket.js`)

describe('Test rendering view', () => {
    it('should call generator function and return string', () => {
        Rocket.send('test1', { foo: 'bar' })
            .then((result) => {
                expect.stringContaining(result.html)
            })
            .catch((error) => {
                console.error(error)
            })
    })
})
