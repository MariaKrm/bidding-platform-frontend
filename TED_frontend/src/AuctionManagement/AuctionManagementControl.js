import React, { Component } from "react"

//Navigation bar for auction-management urls
class AuctionManagementControl extends Component {
	constructor() {
		super()
		this.newAuction = this.newAuction.bind(this)
	}

	newAuction() {
		this.props.history.push("/createAuction")
	}

	render() {
		
		return (
			<div className="management-control">
				<br />
				<br />
				<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.newAuction}>New Auction</button>
				<br />
				<br />

				<nav className="navbar navbar-expand-sm bg-light navbar-light">
					<ul className="nav flex-column ml-auto text-right">
						<li className="nav-item">
							<a className="nav-link active" href="/auction-management/my-open-auctions">My Open Auctions</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/auction-management/my-closed-auctions">My Closed Auctions</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/auction-management/my-bids">My Bids</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/auction-management/my-history">Viewed Auctions</a>
						</li>
					</ul>
				</nav>

			</div>
		)
	}
}

export default AuctionManagementControl