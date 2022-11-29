const mongoose = require('mongoose')

require('dotenv').config()

const devConnection = process.env.DB_STRING
const prodConnection = process.env.DB_STRING_PROD

if (process.env.NODE_ENV === 'production') {
    mongoose.connect(prodConnection)

    mongoose.connection.once('open', () => { console.log('Connected to MongoDB') })
} else {
    mongoose.connect(devConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    mongoose.connection.once('open', () => { console.log('Connected to MongoDB') })
}