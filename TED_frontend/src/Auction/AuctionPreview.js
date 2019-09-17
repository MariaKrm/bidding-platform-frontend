import React, { Component } from "react"
import AuctionOptions from "../Auction/AuctionOptions"
import * as Constants from "../Constants/Constants"


class AuctionPreview extends Component {
	reloadPage() {
		window.location.reload()
	}

	render() {
		const categories = this.props.auction.categories.map(category => {
			return category.name
		})
		const categoryString = categories.join(", ")
		const image = this.props.auction.getMediaPath.length > 0 ? Constants.BASEURL + "/media" + this.props.auction.getMediaPath[0] : require("../images/no_image.png")
		const alt = this.props.auction.getMediaPath.length > 0 ? this.props.auction.name : "no image available"
		const endDate = new Date(this.props.auction.endsAt)
		const ended = endDate < Date.now()

		return (
			<div className="preview">
				<img className="preview-image" src={image} alt={alt}/>
				<div className="preview-text">
					<div className="preview-title-group">
						<a href={`/auctions/${this.props.auction.id}`} className="preview-title">{this.props.auction.name}</a>
						<AuctionOptions auction={this.props.auction} className="preview-menu" then={this.reloadPage} history={this.props.history} />
					</div>
					<div className="preview-details">
						<div className="preview-details-left">
							<p className="preview-categories">{categoryString}</p>
							<p className="preview-location">From {this.props.auction.location.locationTitle}</p>
						</div>
						<div className="preview-details-right">
							<p className="preview-current-price">Currently {this.props.auction.currently}$</p>
							{this.props.auction.buyPrice ? <p className="preview-buy-price">or buy immediately for {this.props.auction.buyPrice}$</p> : null}
							<p className="preview-ends-at">{ended ? "Ended on" : "Ends on"} {endDate.toDateString()}, {endDate.toLocaleTimeString()}</p>
							{this.props.auction.auctionCompleted ? <p className="preview-completed">Completed</p> : null}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default AuctionPreview