import React, { Component } from "react"


class AuctionPreview extends Component {
	render() {
		return (
			<div className="auction-preview">
				<img className="preview-image" src={this.props.image} alt={this.props.altImage} />
				<div className="preview-text">
					<h3 className="preview-title">{this.props.name}</h3>
					<p className="preview-category">{this.props.category}</p>
					<p className="preview-location">From {this.props.location}, {this.props.country}</p>
					<h3 className="preview-description-title">Description:</h3>
					<p className="preview-description">{this.props.description}</p>
				</div>

			</div>
		)
	}
}

export default AuctionPreview