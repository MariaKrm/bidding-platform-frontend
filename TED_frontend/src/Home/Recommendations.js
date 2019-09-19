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
		const me = AuthHelper.me()
		let path
		if(me) {
			path = `lsh?username=${me.username}`
		}
		else {
			path = "visitor"
		}
		customRequest("GET", `/recommend/${path}`)
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