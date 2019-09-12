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
			allNotifications: [],
		}

		this.showAll = this.showAll.bind(this)
		this.allSeen = this.allSeen.bind(this)
		this.getNotifications = this.getNotifications.bind(this)
	}

	allSeen() {
		customRequest("PATCH", "user/allSeen")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
		}).catch(err => {
			displayError(err)
		})
	}

	showAll() {
		customRequest("GET", "user/myNotifications")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				allNotifications: response.data,
			})
		}).catch(err => {
			displayError(err)
		})
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
		if(AuthHelper.loggedIn() || AuthHelper.unverifiedUser()) {
			this.intervalId = setInterval(() => {
				this.getNotifications()
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

		let allNotifications = <button className="notification">Nothing here</button>
		let notifications = <button className="dropdown-item">Nothing here</button>
		let notificationDot = null
		if(this.state.newNotifications) {
			notifications = this.state.notifications.map(notification => {
				return (
					<Notification className="dropdown-item" key={notification.id} id={notification.id} message={notification.message} item={notification.item} type="unseen" />
				)
			})

			notificationDot = <span className="notification-dot">{this.state.notifications.length}</span>
		}
		if(this.state.allNotifications) {
			allNotifications = this.state.allNotifications.map(notification => {
				return (
					<Notification className="dropdown-item" key={notification.id} id={notification.id} message={notification.message} item={notification.item} type={notification.seen ? "seen" : "unseen"} />
				)
			})
		}
		

		return (
			<div>
				<div className="dropdown">
					<button className="header-button" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<i className="fa fa-bell notification-bell">{notificationDot}</i>
					</button>
					<div className="dropdown-menu dropdown-menu-right notification-dropdown" aria-labelledby="dropdownMenuButton">
						{notifications}
						<button className="notification show-all-notification" data-toggle="modal" data-target="#notificationsModal" onClick={this.showAll}>Show All</button>
					</div>
				</div>
				<div class="modal" id="notificationsModal">
					<div class="modal-dialog">
						<div class="modal-content">

							<div class="modal-header">
								<h4 class="modal-title font-weight-bold">All Notifications</h4>
								<button type="button" class="close" data-dismiss="modal">&times;</button>
							</div>

							<div class="modal-body">
								{allNotifications}
							</div>

							<div class="modal-footer">
								<button type="button" class="btn btn-success" data-dismiss="modal" onClick={this.allSeen}>Mark all as seen</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default NotificationDropdown