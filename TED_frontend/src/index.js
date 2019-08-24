import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { Route, Redirect } from "react-router"
import Login from "./Login"
import Signup from "./Signup/Signup"
import VisitorPage from "./VisitorPage"
import HomePage from "./Home/HomePage"
import CreateAuction from "./AuctionPages/CreateAuction"
import CreateCategory from "./AuctionPages/CreateCategory"
import AuctionPage from "./AuctionPages/AuctionPage"
//import UserPage from "./UserPage"
import "./styles/style.css"
import "./styles/form_style.css"
import "./styles/header_style.css"
import "./styles/home_style.css"
import "./styles/auction_style.css"
import "./styles/bid_style.css"

import "react-datepicker/dist/react-datepicker.css"




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
    	<Route path="/home" component={HomePage} />
    	<Route path="/createAuction" component={CreateAuction} />
    	<Route path="/createCategory" component={CreateCategory} />
    	<Route path="/auctions/:id" component={AuctionPage} />
{/*    	<Route path="/user/:id" component={UserPage} /> */}
  	</BrowserRouter>,
	document.getElementById("root")
)