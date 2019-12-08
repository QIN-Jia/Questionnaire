const User = require("../models/User")

const admin = async (req, res, next) => {
    const token = req.header("x-auth")
    try {
        if (!token) throw "no token"
        const user = await User.verifyToken(token)
        if (user) {
            if (user.rank === "admin") {
                req.user = user
                req.token = token
                next()
            }
            else {
                throw "user rank invalid"
            }
        }
        else {
            throw "token invalid"
        }
    } catch (err) {
        res.status(401).send(err)
    }
}   // 用户需要证明自己身份

module.exports = admin