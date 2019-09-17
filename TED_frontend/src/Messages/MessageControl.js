import React, { Component } from "react"

class MessageControl extends Component {
	constructor() {
		super()
		this.newAuction = this.newAuction.bind(this)
	}

	newAuction() {
		this.props.history.push("/createAuction")
	}

	render() {
		
		return (
			<div className="managment-control">
				<br />
				<br />
				<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.newAuction}>Send Message</button>
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