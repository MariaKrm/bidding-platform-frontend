import React, { Component } from "react"

class MessagePreview extends Component {
	render() {
		console.log("this.props.message: ", this.props.message)
		return (
			<div className="preview">
				<button>From {this.props.message.sender} about item {this.props.message.itemId}</button>
			</div>
		)
	}
}

export default MessagePreview