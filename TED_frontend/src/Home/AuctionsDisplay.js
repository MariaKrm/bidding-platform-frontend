import React, { Component } from "react"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import AuctionPreview from "../Elements/AuctionPreview"
import testAuctions from "../testData/testItems.js"

class AuctionsDisplay extends Component {
	constructor() {
		super()
		this.state = {
			auctions: null,
		}

		this.getAuctions = this.getAuctions.bind(this)
	}


	getAuctions() {
		console.log("getAuctions")
	//	axios.get(Constants.BASEURL + "/item/auctions", {headers: AuthHelper.getAuthHeader()} )
	//	customRequest("GET", "/item/openAuctions")
		customRequest("GET", "/item/allAuctions")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				auctions: response.data,
			})
		}).catch(err => {
            displayError(err)
		})
	}

	componentDidMount() {
		this.getAuctions()
	}

	render() {
		var auctionList
		if(this.state.auctions) {
			auctionList = testAuctions.concat(this.state.auctions)
		}
		else {
			auctionList = testAuctions
		}
		
		const auctions = auctionList.map(item => {
			return (
				<AuctionPreview
					key={item.id}
					id={item.id}
					name={item.name}
					media={item.media} 
					buyPrice={item.buyPrice}
					currently={item.currently}
					endsAt={item.endsAt} 
					categories={item.categories} 
					location={item.location}
				/>
			)
		})

		return (
			<div>
				<div className="refresh-button-container">
					<button className="refresh-small" onClick={this.getAuctions}>Refresh</button>
				</div>
				{auctions}
			</div>
		)
	}
}


export default AuctionsDisplay