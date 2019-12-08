const mongoose = require("mongoose")

const SurveySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    title: {
        type: String,
        default: "Survey"
    },

    questions: [
        {
            model: {
                type: String,
                default: "single"
            },
            title: {
                type: String,
                required: true
            },
            options: [String],
            multiple: {
                type: Number,
                default: 1
            }
        }
    ]
})

module.exports = mongoose.model("Survey", SurveySchema)