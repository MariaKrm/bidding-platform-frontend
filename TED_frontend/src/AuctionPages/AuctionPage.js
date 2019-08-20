import React, { Component } from "react"
import { customRequest } from "../utils/AuthHelper"
import Swal from "sweetalert2"



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
			console.log(err)
			var errText = err.response ? err.response.status + ":" + err.response.data.text : err
			Swal.fire({
			    type: "error",
			    title: "Oops...",
			    text: errText,
			})
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
								</div>
								<div className="auction-details-right">
									<p className="preview-current-price">Currently {this.state.data.currently}€</p>
									{this.state.data.buyPrice ? <p className="preview-buy-price">or buy immediately for {this.state.data.buyPrice}€</p> : null}
									<p className="preview-ends-at">{ended ? "Ended on" : "Ends on"} {endDate.toDateString()}, {endDate.toLocaleTimeString()}</p>
								</div>
							</div>
						</div>
					</div>
					<div className="auction-info-bottom">
						<h3 className="auction-description-title">Description:</h3>
						<p className="auction-description">{this.state.data.description}</p>
					</div>
				</div>

				<div className="auction-bids">
					<h3>Bids go here</h3>
				</div>
			</div>
		)
	}
}


export default AuctionPage
