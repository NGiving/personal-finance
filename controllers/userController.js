const utils = require('../services/utils');
const validations = require('../services/validations');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../models');
const { localsName } = require('ejs');

module.exports.user_dashboard = async (req, res) => {
    const expenses = await utils.getUserMonthlyExpenses(req.user._id, 'current')
    const budgets = await utils.getUserMonthlyBudgets(req.user._id, 'current')

    res.render('users/dashboard', {
        page_name: 'dashboard',
        user: req.user,
        expenses: {labels: Object.keys(expenses), data: Object.values(expenses), total: Object.values(expenses).reduce((sum, n) => sum + parseFloat(n), 0)},
        budgets
    })
};

module.exports.user_expenses = async (req, res) => {
    const expenses = await utils.getUserExpenses(req.user._id)

    res.render('users/expenses', { 
        page_name: 'expenses',
        user: req.user,
        expenses
    })
};

module.exports.user_expenses_create_get = (req, res) => {
    res.render('users/expenses-create', {
        page_name: 'expense-create',
        user: req.user
    })
};

module.exports.user_expenses_create_post = [validations.expense, (req, res, next) => {
    const { category, date, description } = req.body
    const errors = validationResult(req).array()
    if (errors.length) {
        res.status(400)
        res.render('users/expenses-create', {
            user: req.user,
            category,
            date,
            description,
            errorMessage: errors,
            page_name: 'expense-create'
        })
    } else {
        next()
    }
}, async (req, res) => {
    const { category, date, amount, description } = req.body
    const amountParsed = amount.replace(/\D/g, '')
    try {
        await utils.createExpense(req.user._id, {
            category, 
            date, 
            amount: amountParsed, 
            description
        })
        res.status(200)
        res.redirect('/user/expenses')
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            error: 'Some error has occurred'
        })
    }
}];

module.exports.user_expenses_edit_get = async (req, res) => {
    try {
        const expId = req.params.id
        const exp = await db.Expense.findById(expId)
        const { category, date, amount, description } = exp
        res.render('users/expenses-edit', {
            user: req.user,
            page_name: 'expense-edit',
            category,
            date,
            amount: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(`${amount/100}.${amount%100}`),
            description
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            error: 'Some error has occurred'
        })
    }
};

module.exports.user_expenses_edit_patch = [validations.expenseEdit, (req, res, next) => {
    const { category, date, amount, description } = req.body
    const errors = validationResult(req).array()
    if (errors.length) {
        console.log(errors)
        
        res.status(400)
        res.render('users/expenses-edit', {
            user: req.user,
            page_name: 'expense-edit',
            category,
            amount,
            date,
            description,
            errorMessage: errors
        })
        res.locals.errorMessage = errors
    } else {
        next()
    }
}, (req, res) => {

}];

module.exports.user_expenses_delete = async (req, res) => {
    const expId = req.body.expId.trim()
    try {
        await utils.deleteUserExpense(expId)
        res.status(204).send()
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            error: 'Some error has occurred'
        })
    }
};

module.exports.user_budgets = async (req, res) => {
    const budgets = await utils.getUserMonthlyBudgets(req.user._id, 'current')
    const expenses = await utils.getUserMonthlyExpenses(req.user._id, 'current')

    res.render('users/budgets', {
        page_name: 'budgets',
        user: req.user,
        budgets,
        expenses
    })
};

module.exports.user_budgets_create_get = (req, res) => {
    res.render('users/budgets-create', {
        page_name: 'budget-create',
        user: req.user
    })
};

module.exports.user_budgets_create_post = [validations.budget, (req, res, next) => {
    const { category, amount } = req.body
    const errors = validationResult(req).array()
    if (errors.length) {
        res.status(400)
        res.render('users/budgets-create', {
            user: req.user,
            category,
            amount: category ? undefined : amount,
            errorMessage: errors,
            page_name: 'budget-create'
        })
    } else {
        next()
    }
}, async (req, res) => {
    const { category, amount } = req.body
    const amountParsed = amount.replace(/\D/g, '')
    try {
        await utils.createBudget(req.user._id, {
            category, 
            amount: amountParsed
        })
        res.status(200)
        res.redirect('/user/budgets')
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            error: 'Some error has occurred'
        })
    }
}];

module.exports.user_invoices = (req, res) => {
    res.render('users/invoices', {
        page_name: 'invoices',
        user: req.user
    })
};

module.exports.user_reports = (req, res) => {
    res.render('users/reports', {
        page_name: 'reports',
        user: req.user
    })
};

module.exports.user_settings = async (req, res) => {
    res.render('users/settings', {
        page_name: 'settings',
        user: req.user
    })
};

module.exports.user_settings_update_put = [validations.settings, async (req, res) => {
    try {
        const { username, email, password } = req.body
        const errors = validationResult(req).array()
        if (errors.length) {
            res.status(400).json({username, email, password, errors})
        } else {
            let args = {}
            if (username.length > 0) args.username = username
            if (email.length > 0) args.email = email
            if (password.length > 0) args.password = bcrypt.hashSync(password, 10)

            const user = await utils.updateUserSettings(req.user._id, args)
            res.redirect(301, '/user/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            error: 'Some error has occurred'
        })
    }
}];

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err)
        res.redirect('/')
    })
}