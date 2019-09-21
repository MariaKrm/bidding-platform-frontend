import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"

//Icon displayed in header with dot if new messages
class MessagesIcon extends Component {
	constructor() {
		super()
		this.state = {
			newMessages: false,
		}

		this.getFirstMessage = this.getFirstMessage.bind(this)
	}

	//Check if the last message sent to user is seen or not (only then show new messages)
	getFirstMessage() {
		customRequest("GET", "/user/receivedMessages?page=0&size=1")
		.then(response => {
			this.setState({
				newMessages: !response.data.empty && !response.data.content[0].seen,
			})
		}).catch(err => {
	//		displayError(err)
		})
	}

	//Check for new messages every 5 seconds (only if not visitor)
	componentDidMount() {
		if(AuthHelper.loggedIn() || AuthHelper.unverifiedUser()) {
			this.intervalId = setInterval(() => {
				this.getFirstMessage()
			}, 5000)
		}
	}

	//Clear the interval
	componentWillUnmount() {
		if(AuthHelper.loggedIn() || AuthHelper.unverifiedUser()) {
			clearInterval(this.intervalId)
		}
	}

	render() {
		//Don't show icon if visitor
		if(!AuthHelper.loggedIn() && !AuthHelper.unverifiedUser()) {
			return null
		}

		//Show a red dot if there are new messages
		let messageDot = null
		if(this.state.newMessages) {
			messageDot = <span className="message-dot" />
		}

		return (
			<a className="header-button" href="/messages/inbox">
			<i className="fa fa-envelope notification-button">{messageDot}</i>
			</a>
		)
	}
}

export default MessagesIcon