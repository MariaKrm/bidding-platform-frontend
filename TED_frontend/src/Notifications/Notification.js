import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"

class Notification extends Component {
	constructor() {
		super()
		this.state = {
			type: "unseen",
		}

		this.handleClick = this.handleClick.bind(this)
	}

	handleClick() {
		customRequest("PATCH", `/user/markNotification/${this.props.notification.id}`)
		.then(response => {
			this.setState({
				type: "seen",
			})

			if(this.props.notification.message.includes("verified")) {
				AuthHelper.verify()
				window.location.reload()
			}

			if(this.props.notification.message.includes("auction")) {
				this.props.history.push(`/auctions/${this.props.notification.itemId}`)
			}
		}).catch(err => {
			displayError(err)
		})
	}

	componentDidMount() {
		this.setState({
			type: this.props.type,
		})
	}

	render() {
		return (
			<button className={"notification " + this.state.type} onClick={this.handleClick} data-dismiss={this.props.dataDismiss}>
				{this.props.notification.message}
			</button>
		)
	}
}

export default Notification