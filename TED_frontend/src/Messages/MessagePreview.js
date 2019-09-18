import React, { Component } from "react"

class MessagePreview extends Component {
	render() {
		console.log("this.props.message: ", this.props.message)
		const fromTo = this.props.sent ? "To " + this.props.message.recipient.username : "From " + this.props.message.sender.username
		return (
			<div className="preview text-left">
				<button className="link-button">{fromTo} about item #{this.props.message.item.id} ({this.props.message.item.name})</button>
			</div>
		)
	}
}

export default MessagePreview