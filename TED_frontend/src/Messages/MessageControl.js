import React, { Component } from "react"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"

class MessageControl extends Component {
	render() {
		return (
			<div className="managment-control">
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