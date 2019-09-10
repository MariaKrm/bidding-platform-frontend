import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch } from "react-router-dom"
import { Route, Redirect } from "react-router"
import Login from "./Login/Login"
import Signup from "./Signup/Signup"
import HomePage from "./Home/HomePage"
import CreateAuction from "./Auction/CreateAuction"
import CreateCategory from "./Auction/CreateCategory"
import AuctionPage from "./Auction/AuctionPage"
import EditAuction from "./Auction/EditAuction"
import MyAuctions from "./AuctionManagment/MyAuctions"
import MyBids from "./AuctionManagment/MyBids"
import PendingRegisters from "./AccountManagment/PendingRegisters"
import AllAccounts from "./AccountManagment/AllAccounts"
import AccountPage from "./Account/AccountPage"
import PageNotFound from "./utils/PageNotFound"

import "./styles/style.css"
import "./styles/form_style.css"
import "./styles/header_style.css"
import "./styles/home_style.css"
import "./styles/auction_style.css"
import "./styles/bid_style.css"
import "./styles/account_style.css"
import "./styles/search_style.css"
import "./styles/image_style.css"

import "react-datepicker/dist/react-datepicker.css"




function App() {
	return (
		<Redirect to='/login' />
	)
}



ReactDOM.render(
	<BrowserRouter> 
		<Switch>
			<Route exact path="/" component={App} />
	    	<Route path="/login" component={Login} />
	    	<Route path="/signup" component={Signup} />
	    	<Route path="/home" component={HomePage} />
	    	<Route path="/auction-managment/my-open-auctions" render={(props) => <MyAuctions completed={false} {...props} />} />
	    	<Route path="/auction-managment/my-closed-auctions" render={(props) => <MyAuctions completed={true} {...props} />} />
	    	<Route path="/auction-managment/my-bids" component={MyBids} />
	    	<Route path="/account-managment/pending-registers" component={PendingRegisters} />
	    	<Route path="/account-managment/all-accounts" component={AllAccounts} />
	    	<Route path="/createAuction" component={CreateAuction} />
	    	<Route path="/createCategory" component={CreateCategory} />
	    	<Route path="/auctions/:id" component={AuctionPage} />
	    	<Route path="/editAuction/:id" component={EditAuction} />
	    	<Route path="/accounts/:username" component={AccountPage} />
	    	<Route component={PageNotFound} />
		</Switch>
  	</BrowserRouter>,
	document.getElementById("root")
)