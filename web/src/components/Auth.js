import React, { useState, useContext, useEffect } from 'react'
import validator from "validator"
import request from "superagent"
import UserContext from "./UserContext"
import { useHistory } from "react-router-dom"
import proxy from "../proxy"

const Auth = ({ register }) => {
    const { user, setUser } = useContext(UserContext)

    const [email, setEmail] = useState("")
    const [password, setPasssword] = useState("")
    const [status, setStatus] = useState("ready")

    const isEmailValid = validator.isEmail(email)
    const isPasswordValid = password.length > 6

    const history = useHistory()

    useEffect(() => {
        if (user) {
            history.push("/")
        }
        else {
            const token = localStorage.getItem("token")
            if (token) {
                request.get(proxy("/me"))
                    .set("x-auth", token)
                    .then((res) => {
                        setUser(res.body)
                        history.push("/")
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
    }, [])

    const onSubmit = () => {
        setStatus("pending")
        request.post(proxy(register ? "/register" : "/login"))
            .send({ email, password })
            .then((res) => {
                const { userId, token } = res.body
                setUser({
                    userId, email
                })
                localStorage.setItem("token", token)
                history.push("/")
            })
            .catch(err => {
                setStatus("fail")
                console.log(err)
            })
    }

    return (
        <div>
            <div className="field">
                <label className="label">Email</label>
                <div className="control has-icons-left has-icons-right">
                    <input
                        className={
                            register && isEmailValid
                                ? "input is-success"
                                : "input"
                        }
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value)
                        }}
                    />
                    <span className="icon is-small is-left">
                        <i className="fas fa-envelope"></i>
                    </span>
                    {
                        register && isEmailValid
                            ? (
                                <span className="icon is-small is-right">
                                    <i className="fas fa-check"></i>
                                </span>
                            )
                            : ''
                    }
                </div>
            </div>

            <div className="field">
                <label className="label">Password</label>
                <div className="control has-icons-left has-icons-right">
                    <input
                        className={
                            register && isPasswordValid
                                ? "input is-success"
                                : "input"
                        }
                        type="password"
                        placeholder="Password (lendth > 6)"
                        value={password}
                        onChange={e => {
                            setPasssword(e.target.value)
                        }}
                    />
                    <span className="icon is-small is-left">
                        <i className="fas fa-key"></i>
                    </span>
                    {
                        register && isPasswordValid
                            ? (
                                <span className="icon is-small is-right">
                                    <i className="fas fa-check"></i>
                                </span>
                            )
                            : ''
                    }
                </div>
            </div>

            <div className="field is-grouped">
                <div className="control">
                    <button
                        className={
                            status === "pending"
                                ? "button is-link is-loading"
                                : "button is-link"
                        }
                        onClick={
                            () => {
                                if (isEmailValid && isPasswordValid) {
                                    if (status !== "pending") {
                                        onSubmit()
                                    }
                                }
                            }
                        }
                        disabled={!(isEmailValid && isPasswordValid)}
                    >
                        {
                            register
                                ? "Register"
                                : "Login"
                        }
                    </button>
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
                status === "fail"
                    ? (
                        <div className="notification is-warning">
                            Your request has failed.
                        {
                                register
                                    ? " The email you register may have existed."
                                    : " Please check your email and password."
                            }
                        </div>
                    )
                    : ""
            }
        </div>
    )
}

export default Auth