import React, { Component } from "react"
import { Redirect } from "react-router"

class AuctionManagment extends Component {

	render() {
		return (
			<Redirect to='/auction-managment/my-open-auctions' />
		)
	}
}

export default AuctionManagment