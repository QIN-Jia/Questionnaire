import React from 'react';
import ReactDOM from 'react-dom'
import "@fortawesome/fontawesome-free/css/all.css"
import "bulma/bulma.sass"
import './index.css';
import './App.scss'
import AppRouter from './AppRouter';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(<AppRouter />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
