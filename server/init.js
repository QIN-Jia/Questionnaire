require("./config/config")
require("./mongoose")
const User = require("./models/User")

const user = new User({
    email: "qj@qq.com",
    password: "1111111",
    rank: "admin"
})

user.save()
    .then(() => {
        console.log("OK")
    })
    .catch(err => {
        console.log(err)
    }) 