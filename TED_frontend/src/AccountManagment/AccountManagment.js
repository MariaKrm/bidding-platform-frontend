import React, { Component } from "react"
import HomeHeader from "../Elements/HomeHeader"
import Navbar from "../Elements/Navbar"

class AccountManagment extends Component {
	render() {
		return (
			<div>
				<HomeHeader />
				<Navbar accountTab="active" />
				<h1>Only for the admin!</h1>
			</div>
		)
	}
}


export default AccountManagment