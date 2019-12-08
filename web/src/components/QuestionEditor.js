import React, { useState, useEffect } from 'react'

const QuestionEditor = ({ onAddQuestion, submit, ...props }) => {

    const [title, setTitle] = useState(props.title || "")
    const [multiple, setMultiple] = useState(props.multiple || 1)
    const [options, setOptions] = useState(props.options || [""])
    const [status, setStatus] = useState("ready")

    const isQuestionReady = (
        title.length
        && options.every(e => e.length)
        && status !== "pending"
        && multiple <= options.length && multiple > 0
    )

    useEffect(() => {
        onAddQuestion({
            title, multiple, options
        })
    }, [isQuestionReady])

    // const onSubmit = () => {
    //     const token = localStorage.getItem("token")
    //     setStatus("pending")
    //     request[surveyId ? "patch" : "post"](proxy("/survey"))
    //         .set("x-auth", token)
    //         .send({
    //             title,
    //             multiple,
    //             options
    //         })
    //         .then(() => {
    //             setStatus("success")
    //         })
    //         .catch(err => {
    //             setStatus("fail")
    //         })
    // }

    // useEffect(() => {
    //     if (surveyId) {
    //         request.get(proxy(`/survey/${surveyId}`))
    //             .then(res => res.body)
    //             .then(survey => {
    //                 const {
    //                     title, multiple,
    //                     options
    //                 } = survey
    //                 setTitle(title)
    //                 setMultiple(multiple)
    //                 setOptions(options)
    //             })
    //             .catch(err => {
    //                 console.log(err)
    //             })
    //     }
    // }, [surveyId])

    return (
        <div>
            <div className="field">
                <label className="label">Title</label>
                <div className="control has-icons-left">
                    <input
                        className="input"
                        type="text"
                        placeholder="title"
                        value={title}
                        onChange={e => { setTitle(e.target.value) }}
                    />
                    <span className="icon is-small is-left">
                        <i className="fas fa-question-circle"></i>
                    </span>
                </div>
            </div>


            <div className="field">
                <label className="label">Maximum choices</label>
                <div className="control has-icons-left">
                    <input
                        className="input"
                        type="text"
                        placeholder="title"
                        value={multiple}
                        onChange={e => {
                            const value = e.target.value
                            setMultiple(value)
                        }}
                    />
                    <span className="icon is-small is-left">
                        <i className="fas fa-list-ol"></i>
                    </span>
                </div>
            </div>

            <div className="field">
                <div className="control">
                    <button
                        className="button is-info"
                        onClick={() => {
                            setOptions(options.concat([""]))
                        }}
                    >
                        add options
                    </button>
                </div>
            </div>

            {
                options.map((e, i) => (
                    <div key={i} className="field is-grouped">
                        <div className="control add-option has-icons-left">
                            <input
                                className="input"
                                type="text"
                                value={e}
                                onChange={e => {
                                    const tmp = options.concat()
                                    tmp[i] = e.target.value
                                    setOptions(tmp)
                                }}
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-list"></i>
                            </span>
                        </div>

                        <div>
                            <button
                                className="button is-text"
                                onClick={() => {
                                    setOptions(options.filter((_, index) => i !== index))
                                }}
                            >
                                <div className="delete"></div>
                            </button>
                        </div>
                    </div>
                ))
            }

            {/* <div className="field">
                <div className="control">
                    <button
                        className={
                            status === "pending"
                                ? "button is-link is-loading"
                                : "button is-link"
                        }
                        disabled={!isQuestionReady}
                        onClick={() => {
                            if(isQuestionReady){
                                
                            }
                        }}
                    >
                        Add Question
                    </button>
                </div>
            </div> */}

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
        </div>
    )
}

export default QuestionEditor