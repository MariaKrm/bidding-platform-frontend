import React, { Component } from "react"
import Swal from "sweetalert2"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"


class AuctionOptions extends Component {
	constructor() {
		super()

		this.editAuction = this.editAuction.bind(this)
		this.submitDelete = this.submitDelete.bind(this)
		this.verifyDelete = this.verifyDelete.bind(this)
		this.deleteAuction = this.deleteAuction.bind(this)
	}

	editAuction() {
		this.props.history.push(`/editAuction/${this.props.auction.id}`)
	}

	submitDelete() {
		console.log("Delete Auction")
		customRequest("DELETE", `/item/${this.props.auction.id}`)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			Swal.fire({
				title: "Success",
				text: "Auction Deleted",
				type: 'success',
			}).then(result => {
				this.props.then()
			})
		}).catch(err => {
			displayError(err)
		})
	}

	verifyDelete() {
    	Swal.fire({
    		title: 'Are you sure?',
    		text: "Delete Auction?",
    		type: 'warning',
    		showCancelButton: true,
    		confirmButtonColor: '#3085d6',
    	 	cancelButtonColor: '#d33',
    		confirmButtonText: 'Delete Auction'
    	}).then(result => {
    		if(result.value) {
    			this.submitDelete()
    		}
    	})
    }

	deleteAuction() {
		this.verifyDelete()
	}

	enableButtons() { 
		var buttons
		const me = AuthHelper.me()
		if(me !== null && me.id === this.props.auction.seller.id) {
			buttons = 
				<div>
					<button className="dropdown-item" onClick={this.editAuction}>Edit Auction</button>
					<button className="dropdown-item" onClick={this.deleteAuction}>Delete Auction</button>
				</div>
		}
		else {
			buttons = 
				<div>
					<button className="dropdown-item" data-toggle="tooltip" title="You are not the creator of this auction" disabled>Edit Auction</button>
					<button className="dropdown-item" ata-toggle="tooltip" title="You are not the creator of this auction" disabled>Delete Auction</button>
				</div>
		}

		return buttons
	}


	render() {
		return (
			<div>
				<button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
				<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
					{this.enableButtons()}
				</div>
			</div>
		)
	}
}

export default AuctionOptions