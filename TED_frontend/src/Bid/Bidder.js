import React, { Component } from "react"
import ReactTooltip from "react-tooltip"

class Bidder extends Component {
	render() {
		const user = this.props.user
		return (
			<div className="bidder">
				<span className="bidder-username">{user.username}</span>
				<span className="seller-rating" data-tip data-for="seller-rating">&nbsp;&nbsp;&nbsp;&nbsp;&#9733;{user.sellerRating}</span>
				<ReactTooltip id="seller-rating" place="top" type="warning" effect="solid">
					<span>Seller Rating</span>
				</ReactTooltip>
				<span className="bidder-rating" data-tip data-for="bidder-rating">&nbsp;&nbsp;&nbsp;&nbsp;&#9733;{user.bidderRating}</span>
				<ReactTooltip id="bidder-rating" place="top" type="success" effect="solid">
					<span>Bidder Rating</span>
				</ReactTooltip>
				<p className="bidder-location">{user.address.locationTitle}</p>
			</div>
		)
	}
}

export default Bidder