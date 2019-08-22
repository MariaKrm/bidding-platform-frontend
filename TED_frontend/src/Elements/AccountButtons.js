import React, { Component } from "react"
import AuthHelper from "../utils/AuthHelper"

class AccountButtons extends Component {
	constructor() {
		super()
		this.displayAccountButtons = this.displayAccountButtons.bind(this)
		this.logout = this.logout.bind(this)
		this.redirectToLogin = this.redirectToLogin.bind(this)
	}

	displayAccountButtons() {
		if(AuthHelper.loggedIn()) {
			return (
				<div className="home-header-actions">
					<button className="header-button">My Account</button>
					<button className="header-button" onClick={this.logout}>Logout</button>
				</div>
			)
		}
		else {
			return (
				<div className="home-header-actions">
					<button className="header-button" onClick={this.redirectToLogin}>Log In/Sign Up</button>
				</div>
			)
		}
	}

	logout() {
		AuthHelper.logout()
		this.redirectToLogin()
	}


	redirectToLogin() {
		this.props.history.push("/login")
	}

	render() {
		return (
			<div>
				{this.displayAccountButtons()}
			</div>
		)
	}
}

export default AccountButtons