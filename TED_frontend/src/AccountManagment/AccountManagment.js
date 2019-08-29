import React, { Component } from "react"
import HomeHeader from "../Elements/HomeHeader"
import Navbar from "../Elements/Navbar"
import AuthHelper from "../utils/AuthHelper"

class AccountManagment extends Component {
	render() {
		if(!AuthHelper.isAdmin()) {
			return (
				<div>
					<br />
					<h1>This page is only available to the admin</h1>
				</div>
			)
		}

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