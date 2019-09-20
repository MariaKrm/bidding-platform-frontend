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
		}).catch(err => {
			displayError(err)
		})
	}

	showAll() {
		customRequest("GET", "user/myNotifications")
		.then(response => {
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
			this.setState({
				notifications: response.data,
				newNotifications: response.data.length > 0,
			})
		}).catch(err => {
	//		displayError(err)
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

		let allNotifications = <button className="notification disabled" disabled>Nothing here</button>
		let notifications = <button className="dropdown-item disabled" disabled>Nothing here</button>
		let notificationDot = null
		if(this.state.newNotifications) {
			notifications = this.state.notifications.map(notification => {
				return (
					<Notification
						className="dropdown-item" 
						key={notification.id} 
						notification={notification}
						type="unseen" 
						history={this.props.history} 
					/>
				)
			})

			notificationDot = <span className="notification-dot">{this.state.notifications.length}</span>
		}
		if(this.state.allNotifications) {
			allNotifications = this.state.allNotifications.map(notification => {
				return (
					<Notification 
						className="dropdown-item" 
						key={notification.id} 
						notification={notification}
						type={notification.seen ? "seen" : "unseen"} 
						history={this.props.history}
						dataDismiss="modal"
					/>
				)
			})
		}
		

		return (
			<div>
				<div className="dropdown">
					<button className="header-button" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<i className="fa fa-bell notification-button">{notificationDot}</i>
					</button>
					<div className="dropdown-menu dropdown-menu-right notification-dropdown" aria-labelledby="dropdownMenuButton">
						{notifications}
						<button className="notification show-all-notification" data-toggle="modal" data-target="#notificationsModal" onClick={this.showAll}>Show All</button>
					</div>
				</div>
				<div className="modal" id="notificationsModal">
					<div className="modal-dialog">
						<div className="modal-content">

							<div className="modal-header">
								<h4 className="modal-title font-weight-bold">All Notifications</h4>
								<button type="button" className="close" data-dismiss="modal">&times;</button>
							</div>

							<div className="modal-body">
								{allNotifications}
							</div>

							<div className="modal-footer">
								<button type="button" className="btn btn-success" data-dismiss="modal" onClick={this.allSeen}>Mark all as seen</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default NotificationDropdown