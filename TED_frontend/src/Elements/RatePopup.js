import React, { Component } from "react"
import StarRatingComponent from "react-star-rating-component"
import Swal from "sweetalert2"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"

class RatePopup extends Component {
	constructor() {
		super()
		this.state = {
			showModal: true,
			rating: 1,
		}

		this.closeModal = this.closeModal.bind(this)
		this.handleStarClick = this.handleStarClick.bind(this)
		this.submitRating = this.submitRating.bind(this)
	}

	closeModal() {
		this.setState({
			showModal: false,
		})
	}

	handleStarClick(nextValue, prevValue, name) {
		this.setState({
			rating: nextValue,
		})
	}

	submitRating() {
		customRequest("PATCH", `/user/rating/${this.props.itemId}?score=${this.state.rating}`)
		.then(response => {
			Swal.fire({
				title: "Success",
				text: "Rating Submited",
				type: 'success',
			})
			this.closeModal()
		}).catch(err => {
			displayError(err)
		})
	}

	render() {
		const style = this.state.showModal ? {display: "block"} : {display: "none"}

		return (
			<div className="modal" id="rateModal" style={style} >
				<div className="modal-dialog">
					<div className="modal-content">

						<div className="modal-header">
							<h4 className="modal-title font-weight-bold">Rate This Transaction</h4>
							<button type="button" className="close" onClick={this.closeModal}>&times;</button>
						</div>

						<div className="modal-body">
							<h5>Were you satisfied with this transaction?</h5>
							<h6>Please rate it</h6>
							<br />

							<StarRatingComponent
								className="star-rating-big"
								name="auctionRating"
								starCount={5}
								value={this.state.rating}
								onStarClick={this.handleStarClick}
							/>
						</div>

						<div className="modal-footer">
							<button type="button" className="btn btn-success" onClick={this.submitRating}>Submit Rating</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default RatePopup