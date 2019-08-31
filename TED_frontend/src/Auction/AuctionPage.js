import React, { Component } from "react"
import Swal from "sweetalert2"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import Bid from "../Bid/Bid"
import Header from "../Elements/Header"
import AccountButtons from "../Elements/AccountButtons"
import AuctionOptions from "./AuctionOptions"
import Bidder from "../Bid/Bidder"
import Map from "../Elements/Map"



class AuctionPage extends Component {
	constructor() {
		super()
		this.state = {
			data: null,
			success: false,
			bid: "",
		}

		this.handleChange = this.handleChange.bind(this)
		this.sendBid = this.sendBid.bind(this)
		this.makeBid = this.makeBid.bind(this)
		this.buyNow = this.buyNow.bind(this)
		this.getAuctionData = this.getAuctionData.bind(this)
		this.toPreviousPage = this.toPreviousPage.bind(this)
	}


	handleChange(event) {
		const {name, value} = event.target
    	this.setState({ [name]: value })
	}

	sendBid(bid) {
		const pathWithParams = `/bid/makeBid/${this.state.data.id}?offer=${bid}`
		customRequest("POST", pathWithParams)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			var newData = this.state.data
			newData.auctionCompleted = response.data.auctionCompleted
			this.setState({
				data: newData,
				success: true,
			})
			setTimeout(() => {
				this.setState({
					success: false,
				})
			}, 2000)
		}).catch(err => {
			displayError(err)
		})
	}

	makeBid(event) {
		event.preventDefault()
		if(this.state.bid) {
			Swal.fire({
				title: 'Are you sure?',
				text: `Bid ${this.state.bid}€ for the item?`,
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
			 	cancelButtonColor: '#d33',
				confirmButtonText: 'Make Bid'
			}).then(result => {
				if(result.value) {
					this.sendBid(this.state.bid)
				}
			})
		}
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
				this.sendBid(this.state.data.buyPrice)
			}
		})
	}

	toPreviousPage() {
		clearInterval(this.intervalId)
		this.props.history.goBack()
	}

	getAuctionData(id) {
		customRequest("GET", `/item/${id}`)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)

			this.setState({
				data: response.data,
			})
		}).catch(err => {
			displayError(err)
		})
	}


	componentDidMount() {
		const path = this.props.location.pathname
		const pos = path.lastIndexOf("/")
		const id = path.slice(pos+1)
		this.getAuctionData(id)
		this.intervalId = setInterval(() => {
			this.getAuctionData(id)
		}, 5000)
	}

	componentWillUnmount() {
		clearInterval(this.intervalId)
	}

	success() {
    	if(this.state.success) {
    		return (
    			<div className="alert alert-success">
    			 	Bid submited.
    			</div>
    		)
    	}
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


		let bids = <div> -- No bids yet -- <br /></div>
		if(this.state.data.bids && this.state.data.bids.length > 0) {
			bids = this.state.data.bids.map(bid => {
				return <Bid key={bid.id} amount={bid.offer} time={bid.createdAt} bidder={bid.bidder} />
			})
		}
		

		var bidGroup, buyNowButton
		if(this.state.data.auctionCompleted || !AuthHelper.loggedIn()) {
			bidGroup = 
				<form className="auction-bid-group">
					<input
						className="auction-bid-field diesabled"
						type="number"
						name="bid"
						value={this.state.bid}
						data-decimals="2"
						disabled
					/>
					<br />
					<button className="btn btn-success disabled btn-margin btn-set-size" disabled>Make Bid</button>
				</form>

			buyNowButton = this.state.data.buyPrice ? <button className="btn btn-success disabled btn-margin btn-set-size" disabled>Buy Now for {this.state.data.buyPrice}€</button> : null
		}
		else {
			bidGroup =
				<form className="auction-bid-group">
					<input
						className="auction-bid-field"
						type="number"
						name="bid"
						value={this.state.bid}
						data-decimals="2"
						min={this.state.data.currently + 0.01}
						step="0.01"
						onChange={this.handleChange}
					/>
					<br />
					<button className="btn btn-success btn-margin btn-set-size" onClick={this.makeBid}>Make Bid</button>
				</form>	

			buyNowButton = this.state.data.buyPrice ? <button className="btn btn-success btn-margin btn-set-size" onClick={this.buyNow}>Buy Now for {this.state.data.buyPrice}€</button> : null
		}

		return (
			<div>
				<div className="home-header">
					<Header />
					<AccountButtons history={this.props.history} />
				</div>
				{AuthHelper.displayVisitorSign()}
				{this.success()}
				<div className="auction-page">
					<div className="auction-info">
						<div className="auction-info-top">
							<img className="preview-image" src={image} alt={alt}/>
							<div className="auction-text">
								<div className="preview-title-group">
									<a href={`/auctions/${this.state.data.id}`} className="preview-title">{this.state.data.name}</a>
									<AuctionOptions auction={this.state.data} className="preview-menu" then={this.toPreviousPage} history={this.props.history} />
								</div>
								<div className="auction-details">
									<div className="auction-details-left">
										<p className="preview-categories">{categoryString}</p>
										<p className="preview-location">From {this.state.data.location.locationTitle}</p>
										<div className="auction-seller">
											<span>by&nbsp;&nbsp;</span> <Bidder user={this.state.data.seller} size="small" />
										</div>
										<br />
										<p className="preview-ends-at">{ended ? "Ended on" : "Ends on"} {endDate.toDateString()}, {endDate.toLocaleTimeString()}</p>
										{this.state.data.auctionCompleted ? <p className="preview-completed">Completed</p> : null}
									</div>
									<div className="auction-details-right">
										<p className="preview-current-price">Currently {this.state.data.currently}€</p>
										{bidGroup}
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
							<Map lat={this.state.data.location.latitude} lon={this.state.data.location.longitude} />
						</div>
					</div>

					<div className="auction-bids">
						<h3 className="auction-bids-title">Bids on the Item</h3>
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
