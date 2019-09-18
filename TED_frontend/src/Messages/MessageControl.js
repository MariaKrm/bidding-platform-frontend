import React, { Component } from "react"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"

class MessageControl extends Component {
	constructor() {
		super()
		this.state = {
			id: "",
		}

		this.testMessage = this.testMessage.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		const value = event.target.value
		this.setState({
			id: value,
		})
	}

	testMessage() {
		customRequest("GET", `user/messageBidder/${this.state.id}?text=Line 1.\nLine 2.\n\nLine 4.`)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
		}).catch(err => {
			displayError(err)
		})
	}

	render() {
		
		return (
			<div className="managment-control">
				<br />
				<br />
				<input type="number" placeholder="id" value={this.state.id} onChange={this.handleChange} />
				<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.testMessage}>Send Test Message</button>
				<br />
				<br />

				<nav className="navbar navbar-expand-sm bg-light navbar-light">
					<ul className="nav flex-column ml-auto text-right">
						<li className="nav-item">
							<a className="nav-link active" href="/messages/inbox">Inbox</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/messages/sent">Sent</a>
						</li>
					</ul>
				</nav>

			</div>
		)
	}
}

export default MessageControl