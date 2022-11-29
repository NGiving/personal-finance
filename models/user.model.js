const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
        username: {
            type: String,
            minLength: 5,
            required: true,
            unqiue: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            minLength: 8,
            required: true
        },
        expenses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Expense'
        }],

        budgets: []
    }, {
    timestamps: true
})

UserSchema.pre('save', async function(next) {
    const user = this
    try {
        if (!user.isModified('password')) {
            next()
        }

        let hash = bcrypt.hashSync(user.password, 10)
        user.password = hash
        next()
    } catch (err) {
        console.error(err)
        next(err)
    }
})

UserSchema.methods.comparePassword = async function(password) {
    try {
        return bcrypt.compareSync(password, this.password)
    } catch (err) {
        console.error(err)
        return false
    }
}

const User = mongoose.model('User', UserSchema)
module.exports = User