import React, { Component } from "react"

class MessagePreview extends Component {
	render() {
		const fromTo = this.props.sent ? "To " + this.props.message.recipient.username : "From " + this.props.message.sender.username
		return (
			<div className="preview text-left">
				<button className={"link-button " + this.props.type} onClick={() => this.props.onClick(this.props.index)}>
					{fromTo} about item #{this.props.message.item.id} ({this.props.message.item.name})
				</button>
			</div>
		)
	}
}

export default MessagePreview