import React, { useContext, useEffect, useState } from 'react'
import proxy from "../proxy"
import request from "superagent"
import Answer from "./Answer"

import { useHistory } from "react-router-dom"

const ResAnwsers = () => {

    const [answers, setAnswers] = useState([])
    const history = useHistory()


    useEffect(() => {
        request.get(proxy("/answers"))
            .then(res => {
                console.log(res)
                setAnswers(res.body)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    return (

        <div>
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">
                            Welcome
                        </h1>
                        <h2 className="subtitle">
                            Survey App
                        </h2>
                    </div>
                </div>
            </section>

            <div className="columns">
                {
                    answers.map((e, i) => (

                        <div className="colum" key={i}>
                            <Answer
                                answer={e}
                            />
                        </div>

                    ))
                }
            </div>
        </div>
    )
}

export default ResAnwsers