import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import NotAvailable from "../utils/NotAvailable"
import HomeHeader from "../Elements/HomeHeader"
import Navbar from "../Elements/Navbar"
import AuctionManagmentControl from "./AuctionManagmentControl"
import BidPreview from "../Bid/BidPreview"


class MyBids extends Component {
	constructor() {
		super()
		this.state = {
			bids: null,
		}

	}

	componentDidMount() {
		if(!AuthHelper.loggedIn()) {
			return false
		}

		customRequest("GET", "/user/myBids")
		.then(response => {
			this.setState({
				bids: response.data
			})
		}).catch(err => {
			displayError(err)
		})
	}

	render() {
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
			myBids = []
		}

		return (
			<div>
				<HomeHeader history={this.props.history} />
				<Navbar auctionTab="active" />
				<div className="managment-page">
					<AuctionManagmentControl history={this.props.history} />
					<div className="managment-content">
						<h2 className="managment-content-title">My Bids</h2>
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