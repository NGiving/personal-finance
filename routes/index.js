const router = require('express').Router()
const indexController = require('../controllers/indexController')

router.get('/', indexController.index)

router.get('/login', indexController.login)

router.post('/login', indexController.login_post)

router.get('/register', indexController.register)

router.post('/register', indexController.register_post)

module.exports = router