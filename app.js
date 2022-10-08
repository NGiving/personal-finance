const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const { body, checkSchema, validationResult } = require('express-validator')
const registrationSchema = {
    email: {
        custom: {
            options: value => {
                return User.find({
                    email: value
                }).then(user => {
                    if (user.length > 0) {
                        return Promise.reject('Email address has been taken')
                    }
                })
            }
        }
    },
    password: {
        isStrongPassword: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        },
        errorMessage: 'Password must have a minimum of 8 characters, contains at least 1 lowercase letter, 1 uppercase letter, and 1 numeric character'
    }
}
const validate = validation => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
    
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            errors: errors.array()
        })
    }
}

// Static Files
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'public/css')))
app.use('/img', express.static(path.join(__dirname, 'public/img')))
app.use('/js', express.static(path.join(__dirname, 'public/js')))

// Templating engine
app.set('view engine', 'ejs')

const urlencodedParser = bodyParser.urlencoded({ extended: false})

// Listen to port 3000
app.listen(port, () => console.log(`Listening to port: ${port}`))

// Home Page
app.get('/', (req, res) => {
    res.render('home')
});

// Sign in Page
app.get('/login', (req, res) => {
    res.render('login')
});

// Sign Up Page
app.get('/register', (req, res) => {
    res.render('register')
});

// Login and Register validation
app.post('/register', validate(checkSchema(registrationSchema)), (res, req) => {
    // Save user
    let username = req.body.username
    let password = req.body.password

    res.status(200).json({
        success: true,
        message: 'Registration successful'
    });
});

app.post('/login', validate([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({
        min: 8
    })
]),
    (req, res) => {
        // look up form in database

        res.status(200).json({
            success: true,
            message: 'Login successful'
        });
    }
);