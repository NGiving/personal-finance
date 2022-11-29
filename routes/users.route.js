const db = require('../models')
const UserController = require('../controllers/user.controller');
const { expenseValidation, budgetValidation } = require('../config/validations');
const { validationResult } = require('express-validator')
const router = require('express').Router()

router.get('/dashboard', UserController.checkAuthenticated, async (req, res) => {
    const expenses = await UserController.getUserMonthlyExpenses(req.user._id, 'current')
    const budgets = await UserController.getUserMonthlyBudgets(req.user._id, 'current')
    res.render('users/dashboard', {
        page_name: 'dashboard',
        user: req.user,
        expenses: {labels: Object.keys(expenses), data: Object.values(expenses), total: Object.values(expenses).reduce((sum, n) => sum + parseFloat(n), 0)},
        budgets: budgets
    })
});

router.get('/invoices', UserController.checkAuthenticated, (req, res) => {
    res.render('users/invoices', {
        page_name: 'invoices',
        user: req.user
    })
});

router.get('/budgets', UserController.checkAuthenticated, async (req, res) => {
    const budgets = await UserController.getUserMonthlyBudgets(req.user._id, 'current')
    const expenses = await UserController.getUserMonthlyExpenses(req.user._id, 'current')

    res.render('users/budgets', {
        page_name: 'budgets',
        user: req.user,
        budgets: budgets,
        expenses: expenses
    })
});

router.get('/budgets/create', UserController.checkAuthenticated, (req, res) => {
    res.render('users/budgets-create', {
        page_name: 'budget-create',
        user: req.user
    })
})

router.post('/budgets/create', UserController.checkAuthenticated, budgetValidation, (req, res, next) => {
    const { category } = req.body
    const errors = validationResult(req).array()
    if (errors.length) {
        res.status(422)
        res.render('users/budgets-create', {
            user: req.user,
            category: category,
            errorMessage: errors,
            page_name: 'budget-create'
        })
    } else {
        next()
    }
}, async (req, res) => {
    const { category, amount } = req.body
    const [dollar, cent] = amount.replaceAll('$', '').replaceAll(',', '').split('.')
    try {
        await UserController.createBudget(req.user._id, {
            category: category, 
            amount: { dollar: dollar, cent: cent }
        })
        res.status(200)
        res.redirect('/user/budgets')
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            error: 'Some error has occurred'
        })
    }
})

router.get('/reports', UserController.checkAuthenticated, (req, res) => {
    res.render('users/reports', {
        page_name: 'reports',
        user: req.user
    })
});

router.get('/expenses', UserController.checkAuthenticated, async (req, res) => {
    const expenses = await UserController.getUserExpenses(req.user._id)
    res.render('users/expenses', { 
        page_name: 'expenses',
        user: req.user,
        expenses: expenses
    })
});

router.get('/expenses/create', UserController.checkAuthenticated, (req, res) => {
    res.render('users/expenses-create', {
        page_name: 'expense-create',
        user: req.user
    })
})

router.post('/expenses/create', UserController.checkAuthenticated, expenseValidation, (req, res, next) => {
    const { category, date, desc } = req.body
    const errors = validationResult(req).array()
    if (errors.length) {
        res.status(422)
        res.render('users/expenses-create', {
            user: req.user,
            category: category,
            date: date,
            description: desc,
            errorMessage: errors,
            page_name: 'expense-create'
        })
    } else {
        next()
    }
}, async (req, res) => {
    const { category, date, amount, description } = req.body
    const [dollar, cent] = amount.replaceAll('$', '').replaceAll(',', '').split('.')
    try {
        await UserController.createExpense(req.user._id, {
            category: category, 
            date: date, 
            amount: { dollar: dollar, cent: cent }, 
            description: description
        })
        res.status(200)
        res.redirect('/user/expenses')
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            error: 'Some error has occurred'
        })
    }
})

module.exports = router