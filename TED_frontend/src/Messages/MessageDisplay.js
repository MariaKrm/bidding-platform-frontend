import React, { Component } from "react"

class MessageDisplay extends Component {
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
						<label className="detail-field">About:</label> Auction #{message.item.id} (<a href={`/auctions/${message.item.id}`}>{message.item.name}</a>)
					</div>
					<br />
					<br />
					<p>{message.message}</p>
				</div>
			</div>
		)
	}
}

export default MessageDisplay