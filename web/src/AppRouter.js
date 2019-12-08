import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Auth from './components/Auth'
import App from "./App"
import request from "superagent"
import proxy from "./proxy"

import UserContext from "./components/UserContext"
import Editor from './components/Editor'
import Answer from "./components/Answer"
import Navbar from './components/Navbar'


const AppRouter = () => {

    const [user, setUser] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            request.get(proxy("/me"))
                .set("x-auth", token)
                .then((res) => {
                    setUser(res.body)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <Router>
                <Navbar />
                <div className="wrapper">
                    <Switch>
                        <Route exact path="/">
                            <App />
                        </Route>

                        <Route path="/register">
                            <Auth register />
                        </Route>

                        <Route path="/login">
                            <Auth />
                        </Route>

                        <Route path="/editor">
                            <Editor />
                        </Route>

                        <Route path="/editor/:surveyId">
                            <Editor />
                        </Route>

                        <Route exact path="/answer/:surveyId">
                            <Answer />
                        </Route>

                        <Route>
                            <div>Page not found</div>
                        </Route>
                    </Switch>
                </div>
            </Router>
        </UserContext.Provider>
    )
}

export default AppRouter