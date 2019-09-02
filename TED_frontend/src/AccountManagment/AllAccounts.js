import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import HomeHeader from "../Elements/HomeHeader"
import Navbar from "../Elements/Navbar"
import AdminOnly from "../utils/AdminOnly"
import AccountManagmentControl from "./AccountManagmentControl"
import AccountPreview from "../Account/AccountPreview"


class AllAccounts extends Component {
	constructor() {
		super()
		this.state = {
			accounts: null,
		}

	}

	getAccounts() {
		customRequest("GET", "/admin/allUsers")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				accounts: response.data.content
			})
		}).catch(err => {
			displayError(err)
		})
	}

	componentDidMount() {
		if(!AuthHelper.isAdmin()) {
			return false
		}

		this.getAccounts()
		
	}


	render() {
		if(!AuthHelper.isAdmin()) {
			return (
				<AdminOnly />
			)
		}

		let allAccounts
		if(this.state.accounts) {
			allAccounts = this.state.accounts.map(item => {
				return (
					<AccountPreview key={item.id} account={item} history={this.props.history} />
				)
			})
		}
		else {
			allAccounts = []
		}

		return (
			<div>
				<HomeHeader history={this.props.history} />
				<Navbar accountTab="active" />
				<div className="auction-managment">
					<AccountManagmentControl history={this.props.history} />
					<div className="auction-managment-myactivity">
						<h2 className="auction-managment-myactivity-title">All Accounts</h2>
						<div>
							{allAccounts}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default AllAccounts