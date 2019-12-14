const app = require("./app")

const expect = require("expect")
const request = require("supertest")

const User = require("./models/User")
const Survey = require("./models/Survey")
const Answer = require("./models/Answer")

const testUser = {
    email: "xxxx@xxx.fr",
    password: "xxxxxxxxx"
}

const testSurvey = {
    title: "test survey",
    questions: [
        {
            model: "single",
            title: "1+1=?",
            options: [
                "1", "2", "3", "4"
            ]
        },
        {
            model: "multiple",
            title: "which are the best languages ?",
            options: [
                "php", "ada", "ocaml", "smalltalk"
            ],
            multiple: 4
        }
    ]
}

const testAnswer = {
    answers: [
        ["2"],
        ["php", "ocaml"]
    ]
}

beforeEach(async () => {
    const user = await User.findOne({ email: testUser.email })
    if (user) {
        const userId = user._id
        await user.delete()
        await Survey.findOneAndDelete({ userId })
        await Answer.findOneAndDelete({ userId })
    }

})

describe('POST /register', () => {
    it("should register a user", async () => {
        const res = await request(app).post("/register")
            .send(testUser)
            .expect(200)

        const { userId, token } = res.body
        const user = await User.findOne({
            _id: userId,
            "tokens.token": token
        })
        expect(user).toBeTruthy()
    })

    it("should not allow identique email address", async () => {
        await new User(testUser).save()
        await request(app).post("/register")
            .send(testUser)
            .expect(400)
    })

    it("should prevent user from using an invalid email address", async () => {
        let fakeUser = { email: "sdfjskjfhsd", password: "sdfsdfsdfs" }
        await request(app).post("/register")
            .send(fakeUser)
            .expect(400)
        const user = await User.findOne({ email: fakeUser.email })
        expect(user).toBeFalsy()
    })
})

describe('POST /login', () => {
    it("should log in", async () => {
        await new User(testUser).save()
        const { userId, token } = (await request(app).post("/login")
            .send(testUser)
            .expect(200)).body
        const user = await User.verifyToken(token)
        expect(user).toBeTruthy()
        expect(user._id.toString()).toEqual(userId)
    })

    it("should prevent user from logging in without a correct password", async () => {
        await new User(testUser).save()
        await request(app).post("/login")
            .send({ email: testUser.email, password: "sdfjkhskjfhskjhfsd" })
            .expect(400)
    })
})


describe('DELETE /logout', () => {

    it("should log out", async () => {
        const user = await new User(testUser).save()
        const token = await user.generateToken()
        await request(app).delete("/logout")
            .set("x-auth", token)
            .expect(200)
        const loggedOutUser = await User.verifyToken(token)
        expect(loggedOutUser).toBeFalsy()
    })

    it("should prevent an unauthorized request", async () => {
        await request(app).delete("/logout")
            .expect(401)
    })  //    如果token不合适。。。
})

describe('POST /survey', () => {
    it("should add a survey", async () => {
        const user = new User(testUser)
        user.rank = "admin"
        await user.save()
        const token = await user.generateToken()

        const { surveyId } = (await request(app).post("/survey")
            .set("x-auth", token)
            .send(testSurvey)
            .expect(200)).body

        const survey = await Survey.findOne({ userId: user._id })
        expect(survey).toBeTruthy()
        expect(survey._id.toString()).toEqual(surveyId)
    })

    it("should control access", async () => {
        const user = new User(testUser)
        await user.save()
        const token = await user.generateToken()
        await request(app).post("/survey")
            .set("x-auth", token)
            .send(testSurvey)
            .expect(401)

        const survey = await Survey.findOne({ userId: user._id })
        expect(survey).toBeFalsy()
    })
})

describe('PATCH /survey', () => {
    it("should modify a survey", async () => {
        const user = new User(testUser)
        user.rank = "admin"
        await user.save()
        const token = await user.generateToken()
        const survey = new Survey({
            userId: user._id,
            ...testSurvey
        })
        await survey.save()

        await request(app).patch("/survey")
            .set("x-auth", token)
            .send({
                surveyId: survey._id,
                ...testSurvey
            })
            .expect(200)
    })
})

describe('DELETE /survey', () => {
    it("should delete a survey", async () => {
        const user = new User(testUser)
        user.rank = "admin"
        await user.save()
        const token = await user.generateToken()
        const survey = new Survey({
            userId: user._id,
            ...testSurvey
        })
        await survey.save()

        await request(app).delete("/survey")
            .set("x-auth", token)
            .send({ surveyId: survey._id })
            .expect(200)

        const deletedSurvey = await Survey.findById(survey._id)
        expect(deletedSurvey).toBeFalsy()
    })
})

describe('POST /answer', () => {
    it("should post an answer", async () => {
        const user = new User(testUser)
        await user.save()
        const token = await user.generateToken()
        const survey = new Survey({
            userId: user._id,
            ...testSurvey
        })
        await survey.save()

        const { answerId } = (await request(app).post("/answer")
            .set("x-auth", token)
            .send({
                userId: user._id,
                surveyId: survey._id,
                ...testAnswer
            })
            .expect(200)).body

        const answer = await Answer.findById(answerId)
        expect(answer).toBeTruthy()
        expect(answer.userId.toString()).toEqual(user._id.toString())
    })

})

describe('GET /answers', () => {

    it("should get all answers", async() => {
        const user = new User(testUser)
        await user.save()

        const token = await user.generateToken()
        
        const survey = new Survey({
            userId: user._id,
            ...testSurvey
        })
        await survey.save()

        const answer = new Answer({
            userId: user._id,
            surveyId: survey._id,
            ...testAnswer
        })
        await answer.save()

        const answers = (await request(app).get("/answers")
                .expect(200)).body

        expect(answers).toBeTruthy()
        expect(answers.length).toEqual(1)
        expect(answers[0]._id.toString()).toEqual(answer._id.toString())
    })
})

describe('GET /surveys', () => {
    it("should get all surveys", async () => {
        const user = new User(testUser)
        await user.save()
        const token = await user.generateToken()
        const survey = new Survey({
            userId: user._id,
            ...testSurvey
        })
        await survey.save()

        const surveys = (await request(app).get("/surveys")
            .expect(200)).body

        expect(surveys).toBeTruthy()
        expect(surveys.length).toEqual(3)
        expect(surveys[2]._id.toString()).toEqual(survey._id.toString())
    })
})

describe('GET /survey/:surveyId', () => {
    it("should get a survey by its id", async () => {
        const user = new User(testUser)
        await user.save()
        const token = await user.generateToken()
        const survey = new Survey({
            userId: user._id,
            ...testSurvey
        })
        await survey.save()

        const getSurvey = (await request(app).get(`/survey/${survey._id}`)
            .expect(200)).body

        expect(getSurvey).toBeTruthy()
        expect(getSurvey._id.toString()).toEqual(survey._id.toString())
    })
})
