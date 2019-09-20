require('dotenv').config()
const rocket = require('../../src/')
const Rocket = new rocket(`${__dirname}/../config/rocket.js`)

describe('Test rendering view', () => {
    it('should call generator function and return string', () => {
        Rocket.send('test4', { foo: 'bar' })
            .then((result) => {
                // The callback if the push notification has been sent
                console.log('result', result)
            })
            .catch((error) => {
                console.error(error)
            })
    })
})
