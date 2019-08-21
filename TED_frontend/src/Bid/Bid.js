import React, { Component } from "react"
import Bidder from "./Bidder"


class Bid extends Component {
	render() {

		const time = new Date(this.props.time)
		return (
			<div className="bid">
				<div className="bid-details">
					<p className="bid-amount">{this.props.amount} €</p>
					<p className="bid-time">{time.toDateString()}, {time.toLocaleTimeString()}</p>
				</div>
				<div className="bid-bidder">
					<Bidder user={this.props.bidder} />
				</div>
			</div>
		)
	}
}

export default Bid