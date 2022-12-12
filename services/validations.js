const { check, body } = require('express-validator')
const db = require('../models')

module.exports.register = [
    check('username')
    .exists({ checkFalsy: true })
    .withMessage('Please enter a username')
    .bail()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Username must be a minimum 5 characters'),

    check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please enter an email')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
            db.User.findOne({ email: req.body.email }, (err, user) => {
                if (err) reject(err)
                if (user) reject('The user with this email already exists')
                resolve(true) 
            })

        })
    }),

    check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please enter a password')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Password must be a minimum of 8 characters')
    .bail()
    .matches(/\d/)
    .withMessage('Password must contain at least one numeric character')
    .bail()
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password should contain at least one special character'),

    check('password2')
    .exists({ checkFalsy: true })
    .withMessage('Please retype your password')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match')
]
    
module.exports.login = [
    check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please enter an email')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email'),

    check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please enter a password')
]

module.exports.expense = [
    check('category')
    .exists({ checkFalsy: true })
    .withMessage('Field is required'),

    check('date')
    .exists({ checkFalsy: true })
    .withMessage('Field is required')
    .bail()
    .isDate()
    .withMessage('Invalid date'),

    check('amount')
    .exists({ checkFalsy: true })
    .withMessage('Field is required')
    .bail()
    .custom((value, { req }) => {
        return /(^\d+\.\d+$)|(\d+)|(^\d*\.\d+$)|(^\d+\.\d*$)/.test(value.replace('$', '').replaceAll(',', ''))
    })
    .withMessage('Please enter a valid numerical value')
    .bail()
    .isCurrency()
    .withMessage('Invalid input')
]

module.exports.expenseEdit = [
    check('category')
    .exists({ checkFalsy: true })
    .withMessage('Field is required'),

    check('date')
    .exists({ checkFalsy: true })
    .withMessage('Field is required')
    .bail()
    .isDate()
    .withMessage('Invalid date'),

    check('amount')
    .if((value, { req }) => value)
    .custom((value, { req }) => {
        return /(^\d+\.\d+$)|(\d+)|(^\d*\.\d+$)|(^\d+\.\d*$)/.test(value.replace('$', '').replaceAll(',', ''))
    })
    .withMessage('Please enter a valid numerical value')
    .bail()
    .isCurrency()
    .withMessage('Invalid input')
]

module.exports.budget = [
    check('category')
    .exists({ checkFalsy: true })
    .withMessage('Field is required')
    .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
            db.User.findById(req.user._id, (err, user) => {
                const month = new Date().getMonth()
                if (err) reject(err)
                if (user.budgets.some(budget => budget.createdAt.getMonth() === month && budget.category === value)) reject('A budget of this category already exists')
                resolve(true)
            })
        })
    }),

    check('amount')
    .exists({ checkFalsy: true })
    .withMessage('Field is required')
    .bail()
    .custom((value, { req }) => {
        return /(^\d+\.\d+$)|(\d+)|(^\d*\.\d+$)|(^\d+\.\d*$)/.test(value.replaceAll('$', '').replaceAll(',', ''))
    })
    .withMessage('Please enter a valid numerical value')
    .isCurrency()
    .withMessage('Invalid input')
]

module.exports.settings = [
    check('username')
    .if((value, { req }) => req.body.username)
    .trim()
    .isLength({ min: 5 })
    .withMessage('Username must be a minimum 5 characters'),

    check('email')
    .if((value, { req }) => req.body.email)
    .isEmail()
    .withMessage('Please enter a valid email')
    .bail()
    .normalizeEmail()
    .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
            db.User.findOne({ email: req.body.email }, (err, user) => {
                if (err) reject(err)
                if (user) reject('The user with this email already exists')
                resolve(true) 
            })

        })
    }),

    check('password')
    .if(body('password').notEmpty())
    .isLength({ min: 8 })
    .withMessage('Password must be a minimum of 8 characters')
    .bail()
    .matches(/\d/)
    .withMessage('Password must contain at least one numeric character')
    .bail()
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password should contain at least one special character')
    .bail()
    .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
            db.User.findById(req.user._id, async (err, user) => {
                const match = await user.comparePassword(value)
                if (err) reject(err)
                if (match) reject('Password is already in use')
                resolve(true)
            })
        })
    }),

    check('confirmPassword')
    .if(body('password').notEmpty())
    .exists({ checkFalsy: true })
    .withMessage('Please retype your password')
    .bail()
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match')
]
