const mongoose = require('mongoose')

const ExpenseSchema = new mongoose.Schema({
    category: String,
    amount: Number,
    date: Date,
    description: String,
    deleted: { type: Boolean, default: false }
})

const Expense = mongoose.model('Expense', ExpenseSchema)
module.exports = Expense