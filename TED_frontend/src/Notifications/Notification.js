import React, { Component } from "react"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"

class Notification extends Component {
	constructor() {
		super()
		this.state = {
			type: "unseen",
		}

		this.notificationSeen = this.notificationSeen.bind(this)
		this.handleClick = this.handleClick.bind(this)
	}

	notificationSeen() {
		customRequest("PATCH", `/user/markNotification/${this.props.id}`)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				type: "seen",
			})
		}).catch(err => {
			displayError(err)
		})
	}

	handleClick() {
		this.notificationSeen()
		//do other stuff depending on what the notification is about
	}

	componentDidMount() {
		this.setState({
			type: this.props.type,
		})
	}

	render() {
		return (
			<button className={"notification " + this.state.type} onClick={this.handleClick}>
				{this.props.message}
			</button>
		)
	}
}

export default Notification