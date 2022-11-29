const db = require('../models')

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.status(401)
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/user/dashboard')
    }
    next()
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
    return (await getUserWithPopulateField(userId, 'expenses')).expenses.sort((a, b) => a.date - b.date).reverse()
}

async function getUserMonthlyExpenses(userId, otp) {
    if (!['previous', 'current'].includes(otp)) return null

    let data = {}
    const month = otp === 'previous' ? (new Date().getMonth()+13)%12 : new Date().getMonth()
    const expenses = await getUserExpenses(userId)
    expenses.filter(exp => new Date(exp.date).getMonth() === month).forEach(exp => {
        if (exp.category in data) data[exp.category] += exp.amount.dollar*100 + exp.amount.cent
        else data[exp.category] = exp.amount.dollar*100 + exp.amount.cent
    })
    for (const [k, v] of Object.entries(data)) {
        data[k] = `${String(v).slice(0, -2)}.${String(v).slice(-2)}`
    }
    return data
}

async function createBudget(userId, budget) {
    return db.User.findByIdAndUpdate(
        userId, { 
            $push: {
                budgets: {
                    category: budget.category,
                    amount: { 
                        dollar: budget.amount.dollar, 
                        cent: budget.amount.cent 
                    },
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
    checkNotAuthenticated,
    createExpense,
    getUserWithPopulateField,
    getUserExpenses,
    getUserMonthlyExpenses,
    createBudget,
    getUserMonthlyBudgets
}