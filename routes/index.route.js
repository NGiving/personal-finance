const router = require('express').Router()
const db = require('../models')
const passport = require('passport')
const { registerValidation, loginValidation } = require('../config/validations')
const { validationResult } = require('express-validator')
const { checkNotAuthenticated } = require('../controllers/user.controller')

router.use('/user', require('./users.route'))

router.get('/', (req, res) => {
    res.render('home');
})

router.get('/login', checkNotAuthenticated, (req, res) => {
    let error = req.flash('errorMessage')
    if (error) res.locals.errorMessage = error
    res.render('login', {
        email: error.some(err => err['param'] === 'password') ? error.find(err => err['param'] === 'password').value : ''
    })
})

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register')
})

router.post('/register', checkNotAuthenticated, registerValidation, (req, res, next) => {
        const errors = validationResult(req).array()
        if (errors.length) {
            res.status(422)
            res.render('register', {
                username: req.body.username,
                email: errors.some(err => err['param'] === 'email') ? '' : req.body.email,
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
                username: username,
                email: email,
                password: password
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
    }
)

router.post('/login', checkNotAuthenticated, loginValidation, (req, res, next) => {
        const errors = validationResult(req).array()
        if (errors.length) {
            res.status(422)
            res.render('login', {
                email: errors.some(err => err['param'] === 'email') ? '' : req.body.email,
                errorMessage: errors
            })
        } else {
            next()
        }
    },
    passport.authenticate('local', {
        successRedirect: '/user/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })
)

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err)
        res.redirect('/')
    })
})

module.exports = router