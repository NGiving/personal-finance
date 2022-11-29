const mongoose = require('mongoose')

const ExpenseSchema = new mongoose.Schema({
    category: String,
    amount: {
        dollar: { type: Number, default: 0 },
        cent: { type: Number, default: 0, max: 100 },
    },
    date: Date,
    description: String
})

const Expense = mongoose.model('Expense', ExpenseSchema)
module.exports = Expense