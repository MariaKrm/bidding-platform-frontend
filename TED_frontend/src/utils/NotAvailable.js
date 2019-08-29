import React from "react"

function NotAvailable() {
	return (
		<div>
			<br />
			<h1>Oops...</h1>
			<br />
			<h2>This page is not available to visitors</h2>
			<br />
			<h3><a href="/login">Login</a> to access this page</h3>
			<br />
			<br />
			<br />
			<br />
			<br />
			<h4>Don't have an account? <a href="/signup">Sign Up!</a></h4>
		</div>
	)
}


export default NotAvailable