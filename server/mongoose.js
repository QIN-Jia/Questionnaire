const mongoose = require("mongoose")

mongoose.Promise = global.Promise

mongoose.connect(process.env.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

module.exports = mongoose