import React, { useContext, useState } from 'react'
import UserContext from "./UserContext"
import SurveyContext from "./surveysContext"

const SurveyCard = ({ survey, onModify, onDelete, onAnswer }) => {

    const { questions } = survey
    const { user } = useContext(UserContext)
    const [modal, setModal] = useState(false)

    return (
        <div className="card">
            <header className="card-header">
                <p className="card-header-title">{survey.title}</p>
            </header>
            <div className="card-content">
                {
                    questions.map((e, i) => {
                        const { title, multiple, options } = e
                        return (
                            <div key={i}>
                                <p className="title">
                                    {title}
                                </p>
                                <p className="subtitle">
                                    Maximum choices: {multiple}
                                </p>
                                <label className="label">Options</label>
                                {
                                    options.map((e, i) => (
                                        <p key={i}>
                                            {e}
                                        </p>
                                    ))
                                }
                                {
                                    i < questions.length - 1
                                        ? <hr />
                                        : ""
                                }
                            </div>
                        )
                    })
                }
            </div>
            <footer className="card-footer">
                {
                    user && user.rank === "admin"
                        ? (
                            <>
                                <p className="card-footer-item" onClick={onModify}>
                                    <a>
                                        Modify
                                </a>
                                </p>
                                <p className="card-footer-item" onClick={() => {
                                    setModal(true)
                                }}>
                                    <a>
                                        Delete
                                </a>
                                </p>
                            </>
                        )
                        : ""
                }
                <p className="card-footer-item" onClick={onAnswer}>
                    <a>
                        Answer
                    </a>
                </p>
            </footer>

            <div className={
                modal
                    ? "modal is-active"
                    : "modal"
            }>
                <div className="modal-background" onClick={() => {
                    setModal(false)
                }}></div>
                <div className="modal-content">
                    <div className="card">
                        <div className="card-content">
                            <strong>
                                Warning, are you sure to delete the survey " {survey.title} "?
                                This action is permenant and cannot be reversed.
                            </strong>
                        </div>
                        <footer className="card-footer">
                            <p className="card-footer-item">
                                <a className="danger" onClick={
                                    () => {
                                        onDelete()
                                        setModal(false)
                                    }
                                }>
                                    Delete
                                </a>
                            </p>
                            <p className="card-footer-item" onClick={() => {
                                setModal(false)
                            }}>
                                <a>
                                    I'm not sure
                                </a>
                            </p>
                        </footer>
                    </div>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={() => {
                    setModal(false)
                }}></button>
            </div>
        </div>
    )
}
export default SurveyCard