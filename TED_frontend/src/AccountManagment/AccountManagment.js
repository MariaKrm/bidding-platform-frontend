import React, { Component } from "react"
import HomeHeader from "../Elements/HomeHeader"
import Navbar from "../Elements/Navbar"
import AuthHelper from "../utils/AuthHelper"
import AdminOnly from "../utils/AdminOnly"

class AccountManagment extends Component {
	render() {
		if(!AuthHelper.isAdmin()) {
			return (
				<AdminOnly />
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