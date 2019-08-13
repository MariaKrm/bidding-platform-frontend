import React, { Component } from "react"


class AuctionPreview extends Component {
	render() {
		const categories = this.props.categories.map(category => {
			return category.name
		})
		const categoryString = categories.join(", ")
		const image = this.props.media ? this.props.media : require("../images/no_image.png")
		var description, fading_description = ""
		if(this.props.description.length <= 400) {
			description = this.props.description
		}
		else {
			description = this.props.description.substring(0,310)
			fading_description = this.props.description.substring(310,400) + "..."
		}
		return (
			<div className="auction-preview">
				<img className="preview-image" src={image} alt={this.props.alt_image} />
				<div className="preview-text">
					<h3 className="preview-title">{this.props.name}</h3>
					<div className="preview-details">
						<div className="preview-details-left">
							<p className="preview-categories">{categoryString}</p>
							<p className="preview-location">From {this.props.location.locationTitle}</p>
						</div>
						<div className="preview-details-right">
							<p className="preview-current-price">Currently {this.props.currently}€</p>
							{this.props.buyPrice ? <p className="preview-buy-price">or buy immediately for {this.props.buyPrice}€</p> : null}
							<p className="preview-ends-at">Ends at {this.props.endsAt}</p>
						</div>
					</div>

					<h3 className="preview-description-title">Description:</h3>
					<p className="preview-description">{description}<span className="preview-description-fading">{fading_description}</span></p>
				</div>
			</div>
		)
	}
}

export default AuctionPreview