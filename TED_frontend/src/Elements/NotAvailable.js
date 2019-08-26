import React, { Component } from "react"

class NotAvailable extends Component {
	render() {
		return (
			<div>
				<br />
				<h1>This page is not available to visitors</h1>
				<br />
				<h2><a href="/login">Login</a> to access this page</h2>
				<br />
				<br />
				<br />
				<br />
				<br />
				<h3>Don't have an account? <a href="/signup">Sign Up!</a></h3>
			</div>
		)	
	}
}


export default NotAvailable