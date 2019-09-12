import React, { Component } from "react"


class RecommendationPreview extends Component {
	render() {
		const categories = this.props.auction.categories.map(category => {
			return category.name
		})
		const categoryString = categories.join(", ")
		return (
			<div className="auction-preview">
				<a href={`/auctions/${this.props.auction.id}`} className="recommendation-title">{this.props.auction.name}</a>
				<p className="recommendation-categories">{categoryString}</p>
			</div>
		)
	}
}

export default RecommendationPreview