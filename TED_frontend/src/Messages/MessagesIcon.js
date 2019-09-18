import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"

class MessagesIcon extends Component {
	constructor() {
		super()
		this.state = {
			newMessages: false,
		}

		this.getFirstMessage = this.getFirstMessage.bind(this)
	}


	getFirstMessage() {
		customRequest("GET", "/user/receivedMessages?page=0&size=1")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				newMessages: !response.data.empty && !response.data.content.seen,
			})
		}).catch(err => {
			displayError(err)
		})
	}

	componentDidMount() {
		if(AuthHelper.loggedIn() || AuthHelper.unverifiedUser()) {
			this.intervalId = setInterval(() => {
				this.getFirstMessage()
			}, 5000)
		}
	}

	componentWillUnmount() {
		if(AuthHelper.loggedIn() || AuthHelper.unverifiedUser()) {
			clearInterval(this.intervalId)
		}
	}

	render() {
		if(!AuthHelper.loggedIn() && !AuthHelper.unverifiedUser()) {
			return null
		}
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