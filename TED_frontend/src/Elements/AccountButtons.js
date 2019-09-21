import React, { Component } from "react"
import AuthHelper from "../utils/AuthHelper"
import NotificationDropdown from "../Notifications/NotificationDropdown"
import MessagesIcon from "../Messages/MessagesIcon"
import ChangePasswordPopup from "./ChangePasswordPopup"

//Notifications, Messages, Login button on right of header
class AccountButtons extends Component {
	constructor() {
		super()
		this.state = {
			username: "",
		}

		this.logout = this.logout.bind(this)
		this.redirectToLogin = this.redirectToLogin.bind(this)
	}


	logout() {
		AuthHelper.logout()
		this.redirectToLogin()
	}


	redirectToLogin() {
		this.props.history.push("/login")
	}

	componentDidMount() {
		const me = AuthHelper.me()
		if(me !== null) {
			this.setState({
				username: me.username,
			})
		}
		else {
			return false;
		}
	}

	render() {
		let loginButton
		if(AuthHelper.loggedIn() || AuthHelper.unverifiedUser()) {
			loginButton = 
				<div className="dropdown">
					<button className="dropdown-toggle header-button" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						{this.state.username}
					</button>
					<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
						<button className="dropdown-item" data-toggle="modal" data-target="#changePasswordModal">Change Password</button>
						<button className="dropdown-item" onClick={this.logout}>Logout</button>
					</div>
				</div>	
		}
		else {
			loginButton = <button className="header-button" onClick={this.redirectToLogin}>Log In/Sign Up</button>
		}

		return (
			<div className="home-header-actions">
				<NotificationDropdown history={this.props.history} />
				<MessagesIcon />
				{loginButton}
				<ChangePasswordPopup />
			</div>
		)
	}
}

export default AccountButtons