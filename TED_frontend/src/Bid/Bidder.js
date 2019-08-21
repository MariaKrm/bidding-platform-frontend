import React, { Component } from "react"

class Bidder extends Component {
	render() {
		const user = this.props.user
		return (
			<div className="bidder">
				<span className="bidder-username">{user.username}</span> <span className="bidder-rating">&#9733;{user.rating}</span>
				<p className="bidder-location">{user.locationTitle}</p>
			</div>
		)
	}
}

export default Bidder