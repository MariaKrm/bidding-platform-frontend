import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import RecommendationPreview from "../Auction/RecommendationPreview"


class Recommendations extends Component {
	constructor() {
		super()
		this.state = {
			recommendations: null,
		}
	}

	componentDidMount() {
		let path
		if(AuthHelper.loggedIn() || AuthHelper.unverifiedUser()) {
			path = "/recommend/lsh"
		}
		else {
			path = "/recommend/visitor"
		}
		customRequest("GET", path)
		.then(response => {
			this.setState({
				recommendations: response.data
			})
		}).catch(err => {
	//		displayError(err)
		})
	}


	render() {
		let recommendations = <div>Loading...</div>
		if(this.state.recommendations) {
			recommendations = this.state.recommendations.map((rec, index) => {
				return (
					<RecommendationPreview key={index} id={index} auction={rec} />
				)
			})
		}
		
		return (
			<div className="recommendations">
				Recommended for you:
				{recommendations}
			</div>
		)
	}
}

export default Recommendations