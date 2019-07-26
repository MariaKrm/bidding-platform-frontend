import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { Route, Redirect } from "react-router"
import Login from "./Login"
import Signup from "./Signup/Signup"
import VisitorPage from "./VisitorPage"
//import UserPage from "./UserPage"
import "./style.css"


function App() {
	return (
		<Redirect to='/login' />
	)
}



ReactDOM.render(
	<BrowserRouter> 
		<Route exact path="/" component={App} />
    	<Route path="/login" component={Login} />
    	<Route path="/signup" component={Signup} />
    	<Route path="/visitor" component={VisitorPage} />
{/*    	<Route path="/user/:id" component={UserPage} /> */}
  	</BrowserRouter>,
	document.getElementById("root")
)