require('dotenv').config()

module.exports = {

    notificationAppLocation: __dirname + '/../notifications',

    views: __dirname + '/../views',

    connection: {
        mail: {
            default: 'mailgun',

            mailgun: {
                driver: 'mailgun',
                apiKey: process.env.MAILGUN_APIKEY,
                domain: process.env.MAILGUN_DOMAIN
            },
            smtp: {
                driver: 'smtp',
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: false,
                requireTLS: true,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            }
        },
        notification: {
            credential: 'cheers-firebase-adminsdk.json',
            databaseURL: 'https://cheers-63cbf.firebaseio.com'
        }
    }
}
