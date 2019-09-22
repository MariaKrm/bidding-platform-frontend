import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"

class NewMessage extends Component {
	constructor(props) {
		super(props)
		const prevMessage = props.reply ? props.sender.username + " wrote:\n" + props.message + "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" : ""
		this.state = {
			newMessage: prevMessage,
			success: false,
		}

		this.handleChange = this.handleChange.bind(this)
		this.sendMessage = this.sendMessage.bind(this)
	}


	handleChange(event) {
		const value = event.target.value
		this.setState({
			newMessage: value,
		})
	}


	sendMessage() {
		//Encrypt line changes to pass through url parameters
		let encryptedMessage = this.state.newMessage.replace(/\n/g, "%0A")

		const me = AuthHelper.me()
		let path
		if(me.id === this.props.item.seller.id) {
			path = "messageBidder"
		}
		else {
			path = "messageSeller"
		}
		customRequest("GET", `/user/${path}/${this.props.item.id}?text=${encryptedMessage}`)
		.then(response => {
			this.setState({
				success: true,
			})
			setTimeout(this.props.goBack, 2000)		//Wait 2 seconds to show success banner
		}).catch(err => {
			displayError(err)
		})
	}

	//Display success banner
	success() {
    	if(this.state.success) {
    		return (
    			<div className="alert alert-success text-center">
    			 	Message sent.
    			</div>
    		)
    	}
    }

	render() {
		return (
			<div className="full-message">
				<div className="preview">
					<button className="link-button" onClick={this.props.goBack}>
						{"< Back to Messages"}
					</button>
				</div>
				{this.success()}
				<div className="message">
					<div className="message-details">
						<label className="detail-field">From:</label> {this.props.sender.username}<br />
						<label className="detail-field">To:</label> {this.props.recipient.username}<br />
						<label className="detail-field">About:</label> Auction #{this.props.item.id} (<a href={`/auctions/${this.props.item.id}`}>{this.props.item.name}</a>)<br />
					</div>
					<br />
					<br />
					<div className="message-input">
						<textarea className="message-textarea" rows="10" cols="100" maxlength="255" value={this.state.newMessage} onChange={this.handleChange} />
						<br />
						{this.state.newMessage.length}/255 characters
						<button className="btn btn-success float-right" type="submit" onClick={this.sendMessage}>Send</button>
					</div>
				</div>
			</div>
		)
	}
}

export default NewMessage