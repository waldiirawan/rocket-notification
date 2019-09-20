require('dotenv').config()
const rocket = require('../../src/')
const Rocket = new rocket(`${__dirname}/../config/rocket.js`)

describe('Test rendering view', () => {
    it('should call generator function and return string', () => {
        Rocket.send('test2', { foo: 'bar' })
            .then((result) => {
                // The callback if the email has been sent
                expect.stringContaining(result.html)
            })
            .catch((error) => {
                console.error(error)
            })
    })
})
