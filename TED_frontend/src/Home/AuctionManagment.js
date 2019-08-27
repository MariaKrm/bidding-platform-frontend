import React, { Component } from "react"
import MyAuctions from "../Account/MyAuctions"
import MyBids from "../Account/MyBids"
import AuthHelper from "../utils/AuthHelper"

class AuctionManagment extends Component {
	constructor() {
		super()
		this.state = {
			choice: "auctions",
		}

		this.handleRadioChange = this.handleRadioChange.bind(this)
		this.newAuction = this.newAuction.bind(this)
	}

	handleRadioChange(event) {
		const { value } = event.target
		this.setState({
			choice: value
		})
	}

	newAuction() {
		this.props.history.push("/createAuction")
	}

	render() {
		return (
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
					<div className="radio">
						<label>
							<input
								type="radio"
								name="opt1"
								value="auctions"
								checked={this.state.choice === "auctions"}
								onChange={this.handleRadioChange}
							/> My Auctions
						</label>
					</div>
					<div className="radio">
						<label>
							<input 
								type="radio"
								name="opt2"
								value="bids"
								checked={this.state.choice === "bids"}
								onChange={this.handleRadioChange}
							/> My Bids
						</label>
					</div>
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
		)
	}
}

export default AuctionManagment