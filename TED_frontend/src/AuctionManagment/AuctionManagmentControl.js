import React, { Component } from "react"

class AuctionManagmentControl extends Component {
	constructor() {
		super()
		this.newAuction = this.newAuction.bind(this)
	}

	newAuction() {
		this.props.history.push("/createAuction")
	}

	render() {
		
		return (
			<div className="auction-managment-control">
				<br />
				<br />
				<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.newAuction}>New Auction</button>
				<br />
				<br />

				<nav className="navbar navbar-expand-sm bg-light navbar-light">
					<ul className="nav flex-column ml-auto text-right">
						<li className="nav-item">
							<a className="nav-link active" href="/auction-managment/my-open-auctions">My Open Auctions</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/auction-managment/my-closed-auctions">My Closed Auctions</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/auction-managment/my-bids">My Bids</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/auction-managment/my-history">Viewed Auctions</a>
						</li>
					</ul>
				</nav>

			</div>
		)
	}
}

export default AuctionManagmentControl