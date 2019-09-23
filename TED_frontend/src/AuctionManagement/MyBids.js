import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import NotAvailable from "../utils/NotAvailable"
import HomeHeader from "../Elements/HomeHeader"
import Navbar from "../Elements/Navbar"
import AuctionManagementControl from "./AuctionManagementControl"
import BidPreview from "../Bid/BidPreview"


class MyBids extends Component {
	constructor() {
		super()
		this.state = {
			bids: null,
		}

		this.getBids = this.getBids.bind(this)

	}

	getBids() {
		customRequest("GET", "/user/myBids")
		.then(response => {
			this.setState({
				bids: response.data
			})
		}).catch(err => {
			displayError(err)
		})
	}

	componentDidMount() {
		//Stop if not logged in
		if(!AuthHelper.loggedIn()) {
			return false
		}

		this.getBids()		
	}

	render() {
		//Page only accessible by logged in users
		if(!AuthHelper.loggedIn()) {
			return (
				<NotAvailable />
			)
		}

		let myBids
		if(this.state.bids) {
			myBids = this.state.bids.map(item => {
				return (
					<BidPreview
						key={item.id}
						bid={item}
					/>
				)
			})
		}
		else {
			myBids = null
		}

		return (
			<div>
				<HomeHeader history={this.props.history} />
				<Navbar auctionTab="active" />
				<div className="management-page">
					<AuctionManagementControl history={this.props.history} />
					<div className="management-content">
						<h2 className="management-content-title">My Bids</h2>
						<div>
							{myBids}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default MyBids