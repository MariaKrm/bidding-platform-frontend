import React, { Component } from "react"
import MyAuctions from "./MyAuctions"
import MyBids from "./MyBids"
import AuthHelper from "../utils/AuthHelper"
import HomeHeader from "../Elements/HomeHeader"
import Navbar from "../Elements/Navbar"
import NotAvailable from "../Elements/NotAvailable"

class AuctionManagment extends Component {
	constructor() {
		super()
		this.state = {
			choice: "open_auctions",

		}

		this.newAuction = this.newAuction.bind(this)
		this.handleTabChange = this.handleTabChange.bind(this)
	}


	newAuction() {
		this.props.history.push("/createAuction")
	}

	handleTabChange(tab) {
		console.log("tab: ", tab)

		this.setState({
			choice: tab
		})
	}


	render() {

		if(!AuthHelper.loggedIn()) {
		    return <NotAvailable />
		}

		let choiceDisplay
		if(this.state.choice === "open_auctions") {
			console.log("open")
			choiceDisplay = <div>
								<h2 className="auction-managment-myactivity-title">My Open Auctions</h2>
								<MyAuctions key={"open"} completed={false} history={this.props.history} />
							</div>
		}
		else if(this.state.choice === "closed_auctions") {
			console.log("closed")
			choiceDisplay = <div className="auction-managment-myactivity">
								<h2 className="auction-managment-myactivity-title">My Closed Auctions</h2>
								<MyAuctions key={"closed"} completed={true} history={this.props.history} />
							</div>
		}
		else {
			console.log("bids")
			choiceDisplay = <div className="auction-managment-myactivity">
								<h2 className="auction-managment-myactivity-title">My Bids</h2>
								<MyBids history={this.props.history} />
							</div>
		}


		return (
			<div>
				<HomeHeader history={this.props.history} />
				<Navbar auctionTab="active" />
				<div className="auction-managment">
					<div className="auction-managment-control">
						<br />
						<br />
						<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.newAuction}>New Auction</button>
						<br />
						<br />

						<nav className="navbar navbar-expand-sm bg-light navbar-light">
							<ul className="nav flex-column ml-auto text-right">
								<li className="nav-item">
									<button className="nav-link active btn btn-link d-inline" onClick={() => this.handleTabChange("open_auctions")}>My Open Auctions</button>
								</li>
								<li className="nav-item">
									<button className="nav-link active btn btn-link d-inline" onClick={() => this.handleTabChange("closed_auctions")}>My Closed Auctions</button>
								</li>
								<li className="nav-item">
									<button className="nav-link btn btn-link d-inline" onClick={() => this.handleTabChange("bids")}>My Bids</button>
								</li>
							</ul>
						</nav>

					</div>
					<div className="auction-managment-myactivity">
						{choiceDisplay}
					</div>
				</div>
			</div>
		)
	}
}

export default AuctionManagment