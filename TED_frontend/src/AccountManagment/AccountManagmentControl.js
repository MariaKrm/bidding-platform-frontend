import React, { Component } from "react"

class AccountManagmentControl extends Component {

	render() {
		return (
			<div className="auction-managment-control">
				<br />

				<nav className="navbar navbar-expand-sm bg-light navbar-light">
					<ul className="nav flex-column ml-auto text-right">
						<li className="nav-item">
							<a className="nav-link active" href="/account-managment/pending-registers">Pending Registers</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/account-managment/all-accounts">All Accounts</a>
						</li>
					</ul>
				</nav>

			</div>
		)
	}
}

export default AccountManagmentControl