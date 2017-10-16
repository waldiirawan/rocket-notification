const ServiceProvider = require('adonis-fold').ServiceProvider

class RocketServiceProvider extends ServiceProvider {

    * register () {
        yield this.registerDrivers()
    }

    * boot () {

    }

    * registerDrivers () {
        const Ioc = use('adonis-fold').Ioc
        const mailgunDriver = require('rocket-notification/drivers/mail/mailgunDriver')
        Ioc.extend('Adonis/Addons/Mail', 'rocketMailgun', function (app) {
          const Config = app.use('Adonis/Src/Config')
          return new mailgunDriver(Config)
        })
    }

}

module.exports = RocketServiceProvider
