import React, { useContext, useEffect, useState } from 'react'
import UserContext from "./components/UserContext"
import proxy from "./proxy"
import request from "superagent"
import SurveyCard from './components/SurveyCard'

import { useHistory } from "react-router-dom"

const App = () => {
  const { user, setUser } = useContext(UserContext)
  const [surveys, setSurveys] = useState([])

  const history = useHistory()

  useEffect(() => {
    request.get(proxy("/surveys"))
      .then(res => {
        console.log(res)
        setSurveys(res.body)
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
          surveys.map((e, i) => (
            <div className="column" key={i}>
              <SurveyCard
                survey={e}
                onModify={() => {
                  history.push(`/editor/${e._id}`)
                }}
                onAnswer={() => {
                  history.push(`/answer/${e._id}`)
                }}
                onDelete={() => {
                  const token = localStorage.getItem("token")
                  request.delete(proxy("/survey"))
                    .set("x-auth", token)
                    .send({surveyId: e._id})
                    .then(() => {
                      console.log("deleted")
                      setSurveys(surveys.filter((_, index) => index !== i))
                    })
                    .catch(err => {
                      console.log(err)
                    })
                }}
              />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default App