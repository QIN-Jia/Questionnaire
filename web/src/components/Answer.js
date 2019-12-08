import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useHistory } from "react-router-dom"
import request from "superagent"
import proxy from "../proxy"
import AnswerQuestion from './AnswerQuestion'
import UserContext from "./UserContext"

const Answer = () => {
    const [questions, setQuestions] = useState([])

    const [title, setTitle] = useState("")
    const [status, setStatus] = useState("ready")
    const [surveyId, setSurveyId] = useState(null)
    const [answer, setAnswer] = useState([])

    const location = useLocation() // URL
    const history = useHistory()

    const isSubmitReady = (
        answer.length === questions.length
        && answer.every(e => e.length)
        && status !== "pending"
    )

    const { user } = useContext(UserContext)

    const onSubmit = (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token")
        setStatus("pending")
        request.post(proxy("/answer"))
            .set("x-auth", token)
            .send({
                surveyId,
                answer
            })
            .then(() => {
                console.log(answer)
                setStatus("success")
            })
            .catch(err => {
                setStatus("fail")
                console.log(err)
            })
    }

    useEffect(() => {
        const paths = location.pathname.split("/")
        if (paths.length > 1) {
            console.log(paths)
            setSurveyId(paths[2])
        }
    }, [location])

    useEffect(() => {
        if (surveyId) {
            request.get(proxy(`/survey/${surveyId}`))
                .then(res => {
                    const { title, questions } = res.body
                    setTitle(title)
                    setQuestions(questions)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [surveyId])

    return (
        <div>
            {
                user
                    ? (
                        <>
                            <section className="hero">
                                <div className="hero-body">
                                    <div className="container">
                                        <h1 className="title">
                                            {title}
                                        </h1>
                                        <h2 className="subtitle">
                                            Please answer these questions
                                        </h2>
                                    </div>
                                </div>
                            </section>
                            {
                                questions.map((e, i) => {
                                    return (
                                        <div key={i}>
                                            <AnswerQuestion
                                                question={e}
                                                onSubmitAnswer={value => {
                                                    const tmp = answer.concat()
                                                    tmp[i] = value
                                                    setAnswer(tmp)
                                                }}
                                            />
                                        </div>
                                    )
                                })
                            }
                            <div className="field is-grouped">
                                <div className="control">
                                    <button
                                        className="button is-link"
                                        disabled={!isSubmitReady}
                                        onClick={onSubmit}
                                    >Submit</button>
                                </div>

                                <div className="control">
                                    <button
                                        className="button is-link is-light"
                                        onClick={() => {
                                            history.push("/")
                                        }}
                                    >Cancel</button>
                                </div>
                            </div>

                            {
                                status === "success"
                                    ? (
                                        <div className="notification">Success</div>
                                    )
                                    : ""
                            }

                            {
                                status === "fail"
                                    ? (
                                        <div className="notification">fail</div>
                                    )
                                    : ""
                            }
                        </>
                    )
                    : "you need to log in to submit your answers."
            }
        </div>
    )
}

export default Answer