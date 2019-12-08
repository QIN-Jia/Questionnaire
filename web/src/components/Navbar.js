import React, { useContext, useState } from 'react'
import { useHistory } from "react-router-dom"
import UserContext from "./UserContext"
import proxy from "../proxy"
import request from "superagent"

const Navbar = () => {

    const history = useHistory()
    const { user, setUser } = useContext(UserContext)
    const [burger, setBurger] = useState(false)

    const onLogout = () => {
        const token = localStorage.getItem("token")
        request.delete(proxy("/logout"))
            .set("x-auth", token)
            .then(() => {
                localStorage.removeItem("token")
                setUser(null)
                history.push("/login")
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a className="navbar-item" href="#" onClick={() => {
                    history.push("/")
                }}>
                    <img className = "img" src="https://cdn.iconscout.com/icon/premium/png-256-thumb/questionnaire-31-913487.png"/>
                </a>

                <a
                    role="button"
                    className={
                        burger
                            ? "navbar-burger burger is-active"
                            : "navbar-burger burger"
                    }
                    aria-label="menu"
                    aria-expanded="false"
                    data-target="navbarBasicExample"
                    onClick={() => {
                        setBurger(!burger)
                    }}
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            {
                burger
                    ? (
                        <div
                            className={burger ? "navbar-menu is-active" : "navbar-menu"}
                            onClick={() => {
                                setBurger(!burger)
                            }}
                        >
                            <div className="navbar-end main-burger">
                            <a className="navbar-item" href="#"
                                    onClick={() => {
                                        history.push("/")
                                    }}>Home</a>
                                <a className="navbar-item" href="#"
                                    onClick={() => {
                                        history.push("/editor")
                                    }}>New Survey</a>
                                {
                                    user
                                        ? (
                                            <a className="navbar-item" href="#" onClick={onLogout}>Log out</a>
                                        )
                                        : (
                                            <>
                                                <a className="navbar-item" href="#" onClick={() => {
                                                    history.push("/login")
                                                }}>Log in</a>
                                                <a className="navbar-item" href="#" onClick={() => {
                                                    history.push("/register")
                                                }}>Register</a>
                                            </>
                                        )
                                }
                            </div>
                        </div>
                    )
                    : ""
            }

            <div id="navbarBasicExample" className="navbar-menu">
                <div className="navbar-start">
                    <a
                        className="navbar-item"
                        onClick={() => {
                            history.push("/")
                        }}
                    >
                        Home
                    </a>

                    <a
                        className="navbar-item"
                        onClick={() => {
                            history.push("/editor")
                        }}
                    >
                        New Survey
                    </a>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            {
                                user
                                    ? (
                                        <>
                                            <a
                                                className="button is-warning"
                                                onClick={onLogout}
                                            >
                                                Log Out
                                            </a>
                                        </>
                                    )
                                    : (
                                        <>
                                            <a
                                                className="button is-primary"
                                                onClick={() => {
                                                    history.push("/login")
                                                }}
                                            >
                                                <strong>Log in</strong>
                                            </a>
                                            <a className="button is-light" onClick={() => {
                                                history.push("/register")
                                            }}>
                                                Register
                                            </a>
                                        </>
                                    )
                            }
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    )
}

export default Navbar