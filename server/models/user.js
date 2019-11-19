const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        trim: true
        // unique: true
    },
    password: {
        type: String,
        minlength: 6
        // required: true
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

UserSchema.pre('save', function (next) {
    let user = this

    if (user.isModified('password')) {
        bcrypt.genSalt(10, function (err, salt) {

            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {

                if (err) return next(err)

                // Store hash in your password DB.
                user.password = hash
                next()
            })
        })
    } else
        next()

})

UserSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

UserSchema.methods.generateToken = function (cb) {
    var user = this
    var token = jwt.sign(user._id.toHexString(), 'secret')

    user.token = token
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}

UserSchema.statics.findByToken = function (token, cb) {
    var user = this

    jwt.verify(token, 'secret', function (err, decode) {
        user.findOne({ "_id": decode, "token": token }, function (err, user) {
            if (err) return cb(err)
            cb(null, user)
        })
    })
}

module.exports = mongoose.model('User', UserSchema)
