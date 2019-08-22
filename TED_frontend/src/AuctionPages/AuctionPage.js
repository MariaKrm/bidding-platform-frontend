import React, { Component } from "react"
import Swal from "sweetalert2"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import testBids from "../testData/testBids.js"
import Bid from "../Bid/Bid"
import Header from "../Elements/Header"


class AuctionPage extends Component {
	constructor() {
		super()
		this.state = {
			data: null,
		}

		this.sendBid = this.sendBid.bind(this)
		this.buyNow = this.buyNow.bind(this)
		this.getAuctionData = this.getAuctionData.bind(this)
	}

	sendBid(bid) {

		const offer = {
			offer: bid
		}

		const pathWithParams = `/bid/makeBid/${this.state.data.id}?offer=${bid}`
		customRequest("POST", pathWithParams)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			if(response.data.auctionCompleted) {
				var newData = this.state.data
				newData.auctionCompleted = response.data.auctionCompleted
				this.setState({
					data: newData
				})
			}
		}).catch(err => {
			displayError(err)
		})
	}

	buyNow() {
		Swal.fire({
			title: 'Are you sure?',
			text: `Buy item for ${this.state.data.buyPrice}`,
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
		 	cancelButtonColor: '#d33',
			confirmButtonText: 'Buy it'
		}).then(result => {
			if(result.value) {
				Swal.fire(
					'Request Sent!'
				)

				this.sendBid(this.state.data.buyPrice)
			}
		})
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
			return <Bid key={bid.id} amount={bid.amount} time={bid.time} bidder={bid.bidder} />
		})

		var bidButton, buyNowButton
		if(this.state.data.auctionCompleted) {
			bidButton = <button className="btn btn-success disabled btn-margin btn-set-size" disabled>Submit Bid</button>
			buyNowButton = this.state.data.buyPrice ? <button className="btn btn-success disabled btn-margin btn-set-size" disabled>Buy Now for {this.state.data.buyPrice}€</button> : null
		}
		else {
			bidButton = <button className="btn btn-success btn-margin btn-set-size">Submit Bid</button>
			buyNowButton = this.state.data.buyPrice ? <button className="btn btn-success btn-margin btn-set-size" onClick={this.buyNow}>Buy Now for {this.state.data.buyPrice}€</button> : null
		}

		return (
			<div>
				<Header />
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
										{this.state.data.auctionCompleted ? <p className="preview-completed">Completed</p> : null}
									</div>
									<div className="auction-details-right">
										<p className="preview-current-price">Currently {this.state.data.currently}€</p>
										{bidButton}
										<br />
										{buyNowButton}
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
			</div>
		)
	}
}


export default AuctionPage
