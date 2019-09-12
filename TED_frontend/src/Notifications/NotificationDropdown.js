import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import Notification from "./Notification"


class NotificationDropdown extends Component {
	constructor() {
		super()
		this.state = {
			newNotifications: false,
			notifications: [],
		}

		this.getNotifications = this.getNotifications.bind(this)
	}

	getNotifications() {
		customRequest("GET", "/user/unseenNotifications")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				notifications: response.data,
				newNotifications: response.data.length > 0,
			})
		}).catch(err => {
			displayError(err)
		})
	}

	componentDidMount() {
		if(AuthHelper.loggedIn()) {
			this.intervalId = setInterval(() => {
				this.getNotifications()
			}, 5000)
		}
	}

	componentWillUnmount() {
		if(AuthHelper.loggedIn()) {
			clearInterval(this.intervalId)
		}
	}

	render() {
		if(!AuthHelper.loggedIn() && !AuthHelper.unverifiedUser()) {
			return null
		}

		let notifications = <button className="dropdown-item">Nothing here</button>
		let notificationDot = null
		if(this.state.newNotifications) {
			notifications = this.state.notifications.map(notification => {
				return (
					<Notification className="dropdown-item" key={notification.id} id={notification.id} message={notification.message} item={notification.item} />
				)
			})

			notificationDot = <span className="notification-dot">{this.state.notifications.length}</span>
		}

		

		return (
			<div className="dropdown">
				<button className="header-button" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				<i className="fa fa-bell notification-bell">{notificationDot}</i>
				</button>
				<div className="dropdown-menu dropdown-menu-right notification-dropdown" aria-labelledby="dropdownMenuButton">
					{notifications}
				</div>
			</div>
		)
	}
}

export default NotificationDropdown