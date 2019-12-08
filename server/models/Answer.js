const mongoose = require("mongoose")

const AnswerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    answers: [[String]]

})

module.exports = mongoose.model("Answer", AnswerSchema)