import React, { Component } from "react"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import testBids from "../testData/testBids.js"
import Bid from "../Bid/Bid"


class AuctionPage extends Component {
	constructor() {
		super()
		this.state = {
			data: null,
		}

		this.getAuctionData = this.getAuctionData.bind(this)
	}

	getAuctionData(id) {
		customRequest("GET", `/item/${id}`)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)

			this.setState({
				data: response.data
			})
		}).catch(err => {
			displayError(err)
		})
	}


	componentWillMount() {
		const path = this.props.location.pathname
		const pos = path.lastIndexOf("/")
		const id = path.slice(pos+1)
		this.getAuctionData(id)
	}

	render() {
		if(this.state.data === null) {
			return (
				<p>Loading...</p>
			)
		}


		const categories = this.state.data.categories.map(category => {
			return category.name
		})
		const categoryString = categories.join(", ")
		const image = this.state.data.media ? this.state.data.media : require("../images/no_image.png")
		const alt = this.state.data.media ? this.state.data.name : "no image available"
		const endDate = new Date(this.state.data.endsAt)
		const ended = endDate < Date.now()

		var bids = testBids.map(bid => {
			return <Bid amount={bid.amount} time={bid.time} bidder={bid.bidder} />
		})

		return (
			<div className="auction-page">
				<div className="auction-info">
					<div className="auction-info-top">
						<img className="preview-image" src={image} alt={alt}/>
						<div className="auction-text">
							<a href={`/auctions/${this.state.data.id}`} className="preview-title">{this.state.data.name}</a>
							<div className="auction-details">
								<div className="auction-details-left">
									<p className="preview-categories">{categoryString}</p>
									<p className="preview-location">From {this.state.data.location.locationTitle}</p>
									<br />
									<p className="preview-ends-at">{ended ? "Ended on" : "Ends on"} {endDate.toDateString()}, {endDate.toLocaleTimeString()}</p>
								</div>
								<div className="auction-details-right">
									<p className="preview-current-price">Currently {this.state.data.currently}€</p>
									<button className="btn btn-success btn-margin btn-set-size">Submit Bid</button>
									<br />
									{this.state.data.buyPrice ? <button className="btn btn-success btn-margin btn-set-size">Buy Now for {this.state.data.buyPrice}€</button> : null}
								</div>
							</div>
						</div>
					</div>
					<div className="auction-info-bottom">
						<h3 className="auction-description-title">Description:</h3>
						<p className="auction-description">{this.state.data.description}</p>
						<div className="auction-pictures">
							Pic thumbs here
						</div>
					</div>
				</div>

				<div className="auction-bids">
					<h3 className="auction-bids-title">Current Bids</h3>
					<ul className="auction-bids-list">
						{bids}
					</ul>
				</div>
			</div>
		)
	}
}


export default AuctionPage
