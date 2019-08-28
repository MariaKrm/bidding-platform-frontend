import React, { Component } from "react"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import AuctionPreview from "../Auction/AuctionPreview"

class MyAuction extends Component {
	constructor() {
		super()
		this.state = {
			auctions: null,
		}

	}

	getOpenAuctions() {
		customRequest("GET", "/user/myCompletedAuctions")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				auctions: response.data
			})
		}).catch(err => {
			displayError(err)
		})
	}

	getClosedAuctions() {
		customRequest("GET", "/user/myOpenAuctions")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				auctions: response.data
			})
		}).catch(err => {
			displayError(err)
		})
	}


	componentDidMount() {
		console.log("this.props.completed: ", this.props.completed)
		if(this.props.completed) {
			this.getOpenAuctions()
		}
		else {
			this.getClosedAuctions()
		}
		
	}

	render() {
		console.log("Im here!")
		let myAuctions
		if(this.state.auctions) {
			myAuctions = this.state.auctions.map(item => {
				return (
					<AuctionPreview
						key={item.id}
						auction={item}
						history={this.props.history}
					/>
				)
			})
		}
		else {
			myAuctions = []
		}

		return (
			<div>
				{myAuctions}
			</div>
		)
	}
}

export default MyAuction