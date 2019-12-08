const config = require("./config.json")
//process.env 系统变量
const mode = process.env.mode || "dev"

const {
    port, db, salt
} = config[mode]

process.env.port = port
process.env.db = db
process.env.salt = salt