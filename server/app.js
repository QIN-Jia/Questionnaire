const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
require("./config/config")
require("./mongoose") // 连接mongo数据库

const User = require("./models/User")
const Survey = require("./models/Survey")
const Answer = require("./models/Answer")

const app = express()

app.use(bodyParser.json())
app.use(cors())

const auth = require("./middleware/auth")
const admin = require("./middleware/admin")

app.post("/register", async (req, res) => {
    const {
        email, password
    } = req.body

    const user = new User({
        email, password
    })

    try {
        await user.save()
        const token = await user.generateToken()
        res.send({ userId: user._id, token })
    }
    catch (err) {
        res.status(400).send(err)
    }
})

app.post("/login", async (req, res) => { // URL
    const {
        email, password
    } = req.body

    try {
        const user = await User.login(email, password)
        const token = await user.generateToken()
        res.send({ userId: user._id, token, rank: user.rank })
    } catch (err) {
        res.status(400).send(err)
    }
})

app.get("/me", auth, (req, res) => {
    res.send(
        {
            email: req.user.email,
            userId: req.user._id,
            rank: req.user.rank
        }
    )
})

app.delete("/logout", auth, async (req, res) => {
    try {
        await req.user.deleteToken(req.token)
        res.send("OK")
    } catch (err) {
        res.status(400).send(err)
    }
})

app.post("/survey", admin, async (req, res) => {
    const {
        questions, title
    } = req.body
    try {
        const survey = new Survey({
            userId: req.user._id,
            questions, title
        })
        await survey.save()
        res.send({
            surveyId: survey._id
        })
    } catch (err) {
        res.status(400).send(err)
    }
})

app.patch("/survey", admin, async (req, res) => {
    const {
        questions,
        title,
        surveyId
    } = req.body
    try {
        const survey = await Survey.findById(surveyId)
        if(!survey) throw "surveyId invalid"
        survey.questions = questions
        survey.title = title
        await survey.save()
        res.send({
            surveyId: survey._id
        })
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

app.delete("/survey", admin, async (req, res) => {
    const {surveyId} = req.body
    try {
        await Survey.findByIdAndDelete(surveyId)
        res.send("OK")
    } catch (err) {
        res.status(400).send(err)
    }
})

app.get("/surveys", async (req, res) => {
    try {
        const surveys = await Survey.find({})
        res.send(surveys)
    } catch (err) {
        res.status(400).send(err)
    }
})

app.get("/survey/:surveyId", async (req, res) => {
    try {
        const {surveyId} = req.params
        console.log(surveyId)
        const survey = await Survey.findById(surveyId)
        if(!survey){
            throw "survey not found"
        }
        res.send(survey)
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

app.get("/answers", async(req, res) => {
    try {
        const answers = await Answer.find({})
        res.send(answers)
    } catch (err) {
        res.status(400).send(err)
    }
})

app.post("/answer", auth, async (req, res) => {
    const {surveyId, answers} = req.body
    try {
        const answer = new Answer({
            userId: req.user._id,
            surveyId,
            answers
        })
        await answer.save()
        res.send({
            answerId: answer._id
        })
    } catch (err) {
        res.status(400).send(err)
    }
})

app.listen(process.env.port)

module.exports = app