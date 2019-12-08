import React, { useState, useEffect } from 'react'
import QuestionEditor from './QuestionEditor'
import request from "superagent"
import proxy from "../proxy"
import { useLocation } from "react-router-dom"

const Editor = () => {
    const [questions, setQuestions] = useState([])

    const [title, setTitle] = useState("")
    const [status, setStatus] = useState("ready")
    const [surveyId, setSurveyId] = useState(null)

    const location = useLocation()

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

    const isQuestionReady = question => {
        const { title, multiple, options } = question
        return (
            title.length
            && multiple <= options.length && multiple > 0
            && options.every(e => e.length)
        )
    }

    const isSubmitReady = (
        title.length
        && questions.every(isQuestionReady)
        && status !== "pending"
    )

    const onSubmit = e => {
        e.preventDefault()
        const token = localStorage.getItem("token")
        setStatus("pending")
        request[surveyId ? "patch" : "post"](proxy("/survey"))
            .set("x-auth", token)
            .send({ questions, surveyId, title })
            .then(() => {
                setStatus("success")
            })
            .catch(err => {
                setStatus("fail")
                console.log(err)
            })
    }

    return (
        <div>
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">
                            Editor
                        </h1>
                        <h2 className="subtitle">
                            Survey App
                        </h2>
                    </div>
                </div>
            </section>
            <div className="field">
                <label className="label">Title</label>
                <div className="control has-icons-left">
                    <input
                        className="input"
                        type="text"
                        placeholder="title"
                        value={title}
                        onChange={e => {
                            setTitle(e.target.value)
                        }}
                    />
                    <span className="icon is-small is-left">
                        <i className="fas fa-poll-h"></i>
                    </span>
                </div>
            </div>
            <div className="field is-grouped">
                <div className="control">
                    <button
                        className="button is-primary"
                        onClick={() => {
                            setQuestions(questions.concat([
                                {
                                    title: "",
                                    multiple: 1,
                                    options: [""]
                                }
                            ]))
                        }}
                    >
                        Add Question
                    </button>
                </div>

                <div className="control">
                    <button
                        className={
                            status === "pending"
                                ? "button is-link is-loading"
                                : "button is-link"
                        }
                        disabled={!isSubmitReady}
                        onClick={onSubmit}
                    >
                        Submit
                    </button>
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

            {
                questions.map((e, i) => (
                    <div className="card" key={i}>
                        <header className="card-header">
                            <p className="card-header-title">Survey</p>
                        </header>
                        <div className="card-content">
                            <QuestionEditor
                                {...e}
                                onAddQuestion={
                                    question => {
                                        const tmp = questions.concat([])
                                        tmp[i] = question
                                        setQuestions(tmp)
                                    }
                                }
                            />
                        </div>

                    </div>
                ))
            }
        </div>
    )
}

export default Editor