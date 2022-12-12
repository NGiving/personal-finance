const validations = require('../services/validations')
const { validationResult } = require('express-validator')
const passport = require('passport')
const db = require('../models')

module.exports.index = (req, res) => {
    res.render('home');
};

module.exports.login = (req, res) => {
    let error = req.flash('errorMessage')
    if (error) res.locals.errorMessage = error
    res.render('login', {
        email: error.find(err => err['param'] === 'password')?.value ?? ''
    })
};

module.exports.login_post = [validations.login, (req, res, next) => {
    const errors = validationResult(req).array()
    if (errors.length) {
        res.status(400)
        res.render('login', {
            email: errors.some(err => err['param'] === 'email') ? '' : req.body.email,
            errorMessage: errors
        })
    } else {
        next()
    }
}, passport.authenticate('local', {
    successRedirect: '/user/dashboard',
    failureRedirect: '/login',
    failureFlash: true
})]

module.exports.register = (req, res) => {
    res.render('register')
};

module.exports.register_post = [validations.register, (req, res, next) => {
    const { email, username } = req.body
    const errors = validationResult(req).array()
    if (errors.length) {
        res.status(400)
        res.render('register', {
            username,
            email: errors.some(err => err['param'] === 'email') ? '' : email,
            errorMessage: errors
        })
    } else {
        next()
    }
},
async (req, res) => {
    const { username, email, password } = req.body
    try {
        const user = new db.User({
            username,
            email,
            password
        })
        await user.save()
        res.status(200)
        res.redirect('/login')
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            error: 'Some error has occurred'
        })
    }
}];