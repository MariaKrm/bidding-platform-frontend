import React, { Component } from "react"


class AuctionPreview extends Component {
	render() {
		return (
			<div className="auction-preview">
				<img className="preview-image" src={this.props.image} alt={this.props.alt_image} />
				<div className="preview-text">
					<h3 className="preview-title">{this.props.name}</h3>
					<div className="preview-details">
						<div className="preview-details-left">
							<p className="preview-category">{this.props.category}</p>
							<p className="preview-location">From {this.props.location}, {this.props.country}</p>
						</div>
						<div className="preview-details-right">
							<p className="preview-current-price">Current Price: {this.props.current_price}€</p>
							<p className="preview-buy-price">or Buy Price: {this.props.buyPrice}€</p>
							<p className="preview-ends-at">Ends at {this.props.endsAt}</p>
						</div>
					</div>

					<h3 className="preview-description-title">Description:</h3>
					<p className="preview-description">{this.props.description}</p>
				</div>
			</div>
		)
	}
}

export default AuctionPreview