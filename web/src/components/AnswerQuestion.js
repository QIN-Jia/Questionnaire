import React, { useState, useEffect } from 'react'

const AnswerQuestion = ({ question, onSubmitAnswer, ...props }) => {
    const { title, multiple, options } = question
    const [answer, setAnswer] = useState([])

    useEffect(() => {
        onSubmitAnswer(answer)
    }, [answer])

    return (
        <div>
            <h1 className="title">{title}</h1>
            <h2 className="subtitle">Maximum choice : {multiple}</h2>
            <div className="options">
                {
                    options.map((e, i) => (
                        <div
                            key={i}
                            className={
                                answer.indexOf(options[i]) > -1
                                ? "option option-chosen"
                                : "option"
                            }
                            onClick={() => {
                                if(answer.indexOf(options[i]) > -1){
                                    setAnswer(answer.filter(element => element !== options[i]))
                                }else {
                                    if(answer.length < multiple){
                                        setAnswer(answer.concat([options[i]]))
                                    }
                                }
                            }}
                        >
                            {e}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default AnswerQuestion