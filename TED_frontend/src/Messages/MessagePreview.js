import React, { Component } from "react"

class MessagePreview extends Component {
	render() {
		return (
			<div className="preview">
				<button>From {this.props.message.sender} about item {this.props.message.itemId}</button>
			</div>
		)
	}
}

export default MessagePreview