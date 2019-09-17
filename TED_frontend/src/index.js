import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch } from "react-router-dom"
import { Route, Redirect } from "react-router"
import Login from "./Login/Login"
import Signup from "./Signup/Signup"
import HomePage from "./Home/HomePage"
import Inbox from "./Messages/Inbox"
import SentMessages from "./Messages/SentMessages"
import CreateAuction from "./Auction/CreateAuction"
import CreateCategory from "./Auction/CreateCategory"
import AuctionPage from "./Auction/AuctionPage"
import EditAuction from "./Auction/EditAuction"
import MyAuctions from "./AuctionManagment/MyAuctions"
import MyBids from "./AuctionManagment/MyBids"
import ViewedAuctions from "./AuctionManagment/ViewedAuctions"
import PendingRegisters from "./AccountManagment/PendingRegisters"
import AllAccounts from "./AccountManagment/AllAccounts"
import AccountPage from "./Account/AccountPage"
import PageNotFound from "./utils/PageNotFound"
import DisplayImage from "./utils/DisplayImage"

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
	    	<Route path="/messages/inbox" component={Inbox} />
	    	<Route path="/messages/sent" component={SentMessages} />
	    	<Route path="/auction-managment/my-open-auctions" render={(props) => <MyAuctions completed={false} {...props} />} />
	    	<Route path="/auction-managment/my-closed-auctions" render={(props) => <MyAuctions completed={true} {...props} />} />
	    	<Route path="/auction-managment/my-bids" component={MyBids} />
	    	<Route path="/auction-managment/my-history" component={ViewedAuctions} />
	    	<Route path="/account-managment/pending-registers" component={PendingRegisters} />
	    	<Route path="/account-managment/all-accounts" component={AllAccounts} />
	    	<Route path="/createAuction" component={CreateAuction} />
	    	<Route path="/createCategory" component={CreateCategory} />
	    	<Route path="/image" component={DisplayImage} />
	    	<Route path="/auctions/:id" render={(props) => <AuctionPage key={props.match.params.id} {...props} /> } />
	    	<Route path="/editAuction/:id" component={EditAuction} />
	    	<Route path="/accounts/:username" component={AccountPage} />
	    	<Route component={PageNotFound} />
		</Switch>
  	</BrowserRouter>,
	document.getElementById("root")
)