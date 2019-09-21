import React, { Component } from "react"
import Swal from "sweetalert2"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"

class MessageDisplay extends Component {
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
		const message = this.props.message
		return (
			<div className="full-message">
				<div className="preview">
					<button className="link-button" onClick={this.props.goBack}>
						{"< Back to Messages"}
					</button>
				</div>
				<div className="message">
					<div className="message-details">
						<label className="detail-field">From:</label> {message.sender.username}<br />
						<label className="detail-field">To:</label> {message.recipient.username}<br />
						<label className="detail-field">About:</label> Auction #{message.item.id} (<a href={`/auctions/${message.item.id}`}>{message.item.name}</a>)<br />
						{!this.props.sent && <button className="reply-button" onClick={() => this.props.reply(this.props.index)}>Reply |&nbsp;</button>}
						<button className="reply-button" onClick={this.deleteMessage}>Delete</button>
					</div>
					<br />
					<br />
					<p className="message-textarea">{message.message}</p>
				</div>
			</div>
		)
	}
}

export default MessageDisplay