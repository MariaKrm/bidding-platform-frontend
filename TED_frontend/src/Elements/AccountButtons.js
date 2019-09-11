import React, { Component } from "react"
import AuthHelper from "../utils/AuthHelper"

class AccountButtons extends Component {
	constructor() {
		super()
		this.state = {
			username: "",
		}

		this.displayAccountButtons = this.displayAccountButtons.bind(this)
		this.logout = this.logout.bind(this)
		this.redirectToLogin = this.redirectToLogin.bind(this)
	}

	displayAccountButtons() {
		if(AuthHelper.loggedIn() || AuthHelper.unverifiedUser()) {
			return (
				<div className="home-header-actions">
					<div className="dropdown">
						<button className="btn btn-secondary dropdown-toggle header-button" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							{this.state.username}
						</button>
						<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
							<button className="dropdown-item" onClick={this.logout}>Logout</button>
						</div>
					</div>
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

	componentDidMount() {
		const me = AuthHelper.me()
		if(me !== null) {
			this.setState({
				username: me.username,
			})
		}
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