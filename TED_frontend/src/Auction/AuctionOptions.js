import React, { Component } from "react"
import Swal from "sweetalert2"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import jsonxml from "jsontoxml"


class AuctionOptions extends Component {
	constructor() {
		super()

		this.editAuction = this.editAuction.bind(this)
		this.submitDelete = this.submitDelete.bind(this)
		this.verifyDelete = this.verifyDelete.bind(this)
		this.deleteAuction = this.deleteAuction.bind(this)
		this.exportXML = this.exportXML.bind(this)
		this.exportJSON = this.exportJSON.bind(this)
	}

	editAuction() {
		console.log("Edit Auction")
		this.props.history.push(`/editAuction/${this.props.auction.id}`)
	}

	submitDelete() {
		console.log("Delete Auction")
		customRequest("DELETE", `/item/${this.props.auction.id}`)
		.then(response => {
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

	exportXML() {
		let xml = jsonxml(this.props.auction, {prettyPrint: true})
		xml = "<item>" + xml + "</item>"
	//	xml.replace("\n", "\n\t")

		const element = document.createElement("a");
		const file = new Blob([xml], {type: 'application/xml'});
		element.href = URL.createObjectURL(file);
		element.download = `auction_${this.props.auction.id}.xml`;
		document.body.appendChild(element); // Required for this to work in FireFox
		element.click();
	}

	exportJSON() {
		let json = JSON.stringify(this.props.auction)

		const element = document.createElement("a");
		const file = new Blob([json], {type: "application/json"});
		element.href = URL.createObjectURL(file);
		element.download = `auction_${this.props.auction.id}.json`;
		document.body.appendChild(element); // Required for this to work in FireFox
		element.click();
	}

	enableButtons() { 
		let buttons
		const me = AuthHelper.me()
		let exportButtons = AuthHelper.isAdmin() ? 
			<div>
				<button className="dropdown-item" onClick={this.exportXML}>Export to XML</button>
				<button className="dropdown-item" onClick={this.exportJSON}>Export to JSON</button>
			</div>
			: null
		
		if(me !== null && me.id === this.props.auction.seller.id) {
			buttons = 
				<div>
					<button className="dropdown-item" onClick={this.editAuction}>Edit Auction</button>
					<button className="dropdown-item" onClick={this.deleteAuction}>Delete Auction</button>
					{exportButtons}
				</div>
		}
		else {
			buttons = 
				<div>
					<button className="dropdown-item" data-toggle="tooltip" title="You are not the creator of this auction" disabled>Edit Auction</button>
					<button className="dropdown-item" ata-toggle="tooltip" title="You are not the creator of this auction" disabled>Delete Auction</button>
					{exportButtons}
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