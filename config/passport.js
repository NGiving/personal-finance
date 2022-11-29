const db = require('../models/index')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

passport.use(new LocalStrategy({
    usernameField: 'email', 
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await db.User.findOne({ email: email })
        if (!user) {
            return done(null, false, req.flash('errorMessage', {param: 'email', msg: 'This email has not been registered'}))
        }
        const match = await user.comparePassword(password)
        if (!match) {
            return done(null, false, req.flash('errorMessage', {value: email, param: 'password', msg: 'Incorrect password'}))
        }
        return done(null, user)
    } catch (err) {
        return done(err)
    }
}))

passport.serializeUser((user, done) => done(null, user._id))

passport.deserializeUser((id, done) => {
    db.User.findById(id).then((user) => {
        done(null, user)
    }).catch(err => done(err))
})
