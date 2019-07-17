import React from "react"
import ReactDOM from "react-dom"
import { Link, BrowserRouter } from "react-router-dom"
import { Router, Route, browserHistory } from "react-router"
import Login from "./Login"
import Signup from "./Signup"
import VisitorPage from "./VisitorPage"
import UserPage from "./UserPage"
import "./style.css"


ReactDOM.render(
	<BrowserRouter>  
    	<Route exact path="/" component={Login} />
    	<Route path="/signup" component={Signup} />
    	<Route path="/visitor" component={VisitorPage} />
    	<Route path="/user/:id" component={UserPage} />
  	</BrowserRouter>,
	document.getElementById("root")
)