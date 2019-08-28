import React, { Component } from "react"
import MyAuctions from "../Account/MyAuctions"
import MyBids from "../Account/MyBids"
import AuthHelper from "../utils/AuthHelper"
import HomeHeader from "../Elements/HomeHeader"
import Navbar from "../Elements/Navbar"

class AuctionManagment extends Component {
	constructor() {
		super()
		this.state = {
			choice: "auctions",
		}

		this.newAuction = this.newAuction.bind(this)
		this.handleTabChange = this.handleTabChange.bind(this)
	}


	newAuction() {
		this.props.history.push("/createAuction")
	}

	handleTabChange(tab) {
		this.setState({
			choice: tab
		})
	}


	render() {
		return (
			<div>
				<HomeHeader history={this.props.history} />
				<Navbar auctionTab="active" />
				<div className="auction-managment">
					<div className="auction-managment-control">
						<br />
						<br />
						{AuthHelper.loggedIn() ? 
							<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.newAuction}>New Auction</button>
							: <button className="btn btn-success disabled btn-margin btn-set-size" disabled>New Auction</button>
						}
						<br />
						<br />

						<nav className="navbar navbar-expand-sm bg-light navbar-light">
							<ul className="nav flex-column ml-auto">
								<li className="nav-item">
									<a className="nav-link active" href="#my-auctions" onClick={() => this.handleTabChange("auctions")}>My Auctions</a>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="#my-bids" onClick={() => this.handleTabChange("bids")}>My Bids</a>
								</li>
							</ul>
						</nav>

					</div>
					{this.state.choice === "auctions" ?
						<div className="auction-managment-myactivity">
							<h2 className="auction-managment-myactivity-title">My Auctions</h2>
							<MyAuctions history={this.props.history} />
						</div>
						:
						<div className="auction-managment-myactivity">
							<h2 className="auction-managment-myactivity-title">My Bids</h2>
							<MyBids history={this.props.history} />
						</div>
					}
					
				</div>
			</div>
		)
	}
}

export default AuctionManagment