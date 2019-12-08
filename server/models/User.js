const mongoose = require("mongoose")
const { isEmail } = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: isEmail,
            msg: "email invalid"
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    rank: {
        type: String,
        default: "user"
    },

    tokens: [
        {
            token: {
                type: String
            }
        }
    ]
})

UserSchema.methods.promote = function () {
    this.rank = "admin"
    return this.save()
}

UserSchema.methods.demote = function () {
    this.rank = "user"
    return this.save()
}

UserSchema.methods.generateToken = function () {
    const user = this
    const token = jwt.sign({
        _id: user._id
    }, process.env.salt).toString()
    user.tokens.push({ token })
    return user.save().then(() => token)
}

UserSchema.statics.verifyToken = function (token) {
    const User = this
    try {
        const { _id } = jwt.decode(token, process.env.salt)
        return User.findOne({
            _id,
            "tokens.token": token
        })
    }
    catch (err) {
        return Promise.reject(err)
    }
}

UserSchema.statics.findByToken = function (token) {
    const User = this
    try {
        const { _id } = jwt.decode(token, process.env.salt)
        return User.findOne({
            _id,
            "tokens.token": token
        })
    }
    catch (err) {
        return Promise.resolve(null)
    }
}

UserSchema.methods.deleteToken = function (token) {
    const user = this
    return user.updateOne({
        $pull: {
            tokens: { token }
        }
    })
}

UserSchema.methods.deleteAllToken = function () {
    const user = this
    user.tokens = []
    return user.save()
}

UserSchema.statics.login = function (email, password) {
    var User = this

    return User.findOne({ email })
        .then(user => {
            if (!user) return Promise.reject("User not found")

            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, res) => {
                    if (res) resolve(user)
                    else reject("Wrong password")
                })
            })
        })
}

UserSchema.pre("save", function (next) { //中间键 插入在 save之前 没变的话就下一步
    var user = this
    if (user.isModified("password")) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                user.tokens = []
                next()
            })
        })
    }
    else next()
})

module.exports = mongoose.model("User", UserSchema)