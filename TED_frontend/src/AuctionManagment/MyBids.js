import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import NotAvailable from "../utils/NotAvailable"
import HomeHeader from "../Elements/HomeHeader"
import Navbar from "../Elements/Navbar"
import AuctionManagmentControl from "./AuctionManagmentControl"
import Bid from "../Bid/Bid"


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
			console.log("response: ", response)
			console.log("response.data: ", response.data)
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
					<Bid
						key={item.id}
						amount={item.offer}
						time={item.createdAt}
						bidder={item.bidder}
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
				<div className="auction-managment">
					<AuctionManagmentControl history={this.props.history} />
					<div className="auction-managment-myactivity">
						<h2 className="auction-managment-myactivity-title">My Bids</h2>
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