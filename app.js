const path = require('path')
const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
const { startJob } = require('./services/service')
require('dotenv').config()

// Initialization
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use('/css', express.static(path.join(__dirname, 'public/css')))
app.use('/img', express.static(path.join(__dirname, 'public/img')))
app.use('/js', express.static(path.join(__dirname, 'public/js')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// MongoDB connection
require('./config/database')

// Passport initialization
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const passport = require('passport')
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ client: mongoose.connection.getClient() }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 3
    }
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
require('./config/passport')

// Routes
const { checkAuthenticated } = require('./services/utils')
app.all('*', checkAuthenticated)
app.use('/', require('./routes/index'))
app.use('/user', require('./routes/user'))

// Cron Jobs
startJob()

// Listen to port 3000
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening to port: ${port}`))