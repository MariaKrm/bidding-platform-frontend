import React, { Component } from "react"
import Bid from "./Bid"

//Preview of Bid in MyBids (with reference to auction)
class BidPreview extends Component {
	render() {
		const auction = this.props.bid.item
		const categories = auction.categories.map(category => {
			return category.name
		})
		const categoryString = categories.join(", ")


		return (
			<div className="bid-preview">
				<div className="preview-title-group">
					<a href={`/auctions/${auction.id}`} className="preview-title">{auction.name}</a>
					{auction.auctionCompleted ? <p className="preview-completed">Completed</p> : null}
				</div>
				<p className="bid-preview-categories">{categoryString}</p>

				<div className="bid-preview-bid">
					<Bid amount={this.props.bid.offer} time={this.props.bid.createdAt} bidder={this.props.bid.bidder} />
				</div>
			</div>
		)
	}
}

export default BidPreview