import React, { Component } from "react"
import Swal from "sweetalert2"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"

class MessagePreview extends Component {
	constructor() {
		super()

		this.submitDelete = this.submitDelete.bind(this)
		this.verifyDelete = this.verifyDelete.bind(this)
		this.deleteMessage = this.deleteMessage.bind(this)
	}

	submitDelete() {
		customRequest("PATCH", `/user/deleteMessage/${this.props.message.id}`)
		.then(response => {
			Swal.fire({
				title: "Success",
				text: "Message Deleted",
				type: 'success',
			}).then(result => {
				window.location.reload()
			})
		}).catch(err => {
			displayError(err)
		})
	}

	verifyDelete() {
    	Swal.fire({
    		title: 'Are you sure?',
    		text: "Delete Message?",
    		type: 'warning',
    		showCancelButton: true,
    		confirmButtonColor: '#3085d6',
    	 	cancelButtonColor: '#d33',
    		confirmButtonText: 'Delete Message'
    	}).then(result => {
    		if(result.value) {
    			this.submitDelete()
    		}
    	})
    }

	deleteMessage() {
		this.verifyDelete()
	}

	render() {
		const fromTo = this.props.sent ? "To " + this.props.message.recipient.username : "From " + this.props.message.sender.username
		return (
			<div className="preview text-left">
				<button className={"link-button " + this.props.type} onClick={() => this.props.onClick(this.props.index)}>
					{fromTo} about item #{this.props.message.item.id} ({this.props.message.item.name})
				</button>
				<br />
				<button className="reply-button" onClick={this.deleteMessage}>Delete</button>
			</div>
		)
	}
}

export default MessagePreview