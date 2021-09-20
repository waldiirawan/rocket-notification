require('dotenv').config()

module.exports = {

    notificationAppLocation: __dirname + '/../notifications',

    views: __dirname + '/../views',

    connection: {
        mail: {
            default: process.env.MAIL_DEFAULT,

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
        sms: {
            default: 'nexmo',

            nexmo: {
                apiKey: process.env.NEXMO_API_KEY,
                apiSecret: process.env.NEXMO_API_SECRET,
                applicationId: process.env.NEXMO_APP_ID,
                privateKey: process.env.NEXMO_PRIVATE_KEY_PATH
            }
        },
        chat: {
            default: 'telegram',

            telegram: {
                initApp: false,
                botToken: process.env.TELEGRAM_BOT_TOKEN,
                botSend: process.env.TELEGRAM_GENERAL_CHAT_ID
            },
            api: {
                baseURL: process.env.CHAT_API_BASE_URL,
                sendURLPath: process.env.CHAT_API_SEND_URL_PATH,
                apiKey: process.env.CHAT_API_KEY,
            }
        },
        pushnotif: {
            default: 'firebase',
            firebase: {
                driver: 'firebase',
                initApp: true,
                configType: 'json', // json or field,
                jsonFile: `${__dirname}/service-account-key.json`,
                projectId: process.env.FIRBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey:  process.env.FIREBASE_PRIVATE_KEY,
                databaseURL: process.env.FIREBASE_DATABASE_URL,
                clickAction: 'TOLONGIN_APPS',
                options: {
                    priority: 'high',
                    content_available: true
                }
            }
        }
    }
}
