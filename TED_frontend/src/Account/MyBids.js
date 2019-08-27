import React, { Component } from "react"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import Bid from "../Bid/Bid"


class MyBids extends Component {
	constructor() {
		super()
		this.state = {
			bids: null,
		}

	}

	componentDidMount() {
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
				{myBids}
			</div>
		)
	}
}

export default MyBids