const db = require('../models')
const mongoose = require('mongoose')

function checkAuthenticated(req, res, next) {
    const nonSecurePaths = ['/', '/login', '/register']
    if (nonSecurePaths.includes(req.path) && req.isAuthenticated()) {
        return res.redirect('/user/dashboard')
    } else if (!nonSecurePaths.includes(req.path) && !req.isAuthenticated()) {
        res.status(401)
        res.redirect('/login')
    } else {
        return next()
    }
}

async function updateUserSettings(userId, args) {
    return db.User.findByIdAndUpdate(userId, args)
}

async function createExpense(userId, expense) {
    return db.Expense.create(expense).then((docExpense) => {
        return db.User.findByIdAndUpdate(
            userId,
            { $push: { expenses: docExpense._id }},
            { new: true }
        )
    })
}

async function getUserWithPopulateField(userId, fieldname) {
    return db.User.findById(userId).populate({path: fieldname})
}

async function getUserExpenses(userId) {
    return (await getUserWithPopulateField(userId, 'expenses')).expenses.filter(exp => !exp.deleted).sort((a, b) => a.date - b.date).reverse()
}

async function getUserMonthlyExpenses(userId, otp) {
    if (!['previous', 'current'].includes(otp)) return null

    let data = {}
    const month = otp === 'previous' ? (new Date().getMonth()+13)%12 : new Date().getMonth()
    const expenses = await getUserExpenses(userId)
    expenses.filter(exp => new Date(exp.date).getMonth() === month).forEach(exp => {
        if (exp.category in data) data[exp.category] += exp.amount
        else data[exp.category] = exp.amount
    })
    for (const [k, v] of Object.entries(data)) {
        data[k] = `${String(v).slice(0, -2)}.${String(v).slice(-2)}`
    }
    return data
}

async function deleteUserExpense(expenseId) {
    return db.Expense.findByIdAndUpdate(expenseId, { deleted: true })
}

async function createBudget(userId, budget) {
    return db.User.findByIdAndUpdate(
        userId, { 
            $push: {
                budgets: {
                    category: budget.category,
                    amount: budget.amount,
                    createdAt: new Date()
                }
            }
        }
    )
}

async function getUserMonthlyBudgets(userId, otp) {
    if (!['previous', 'current'].includes(otp)) return null

    const month = otp === 'previous' ? (new Date().getMonth()+13)%12 : new Date().getMonth()
    return (await db.User.findById(userId)).budgets.filter(budget => new Date(budget.createdAt).getMonth() === month)
}

module.exports = {
    checkAuthenticated,
    updateUserSettings,
    getUserWithPopulateField,
    getUserExpenses,
    getUserMonthlyExpenses,
    createExpense,
    deleteUserExpense,
    createBudget,
    getUserMonthlyBudgets
}