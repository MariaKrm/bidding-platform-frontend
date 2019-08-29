import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import HomeHeader from "../Elements/HomeHeader"
import Navbar from "../Elements/Navbar"
import AdminOnly from "../utils/AdminOnly"
import AccountManagmentControl from "./AccountManagmentControl"
import AccountPreview from "../Account/AccountPreview"


class PendingRegisters extends Component {
	constructor() {
		super()
		this.state = {
			accounts: null,
		}

	}

	getAccounts() {
		customRequest("GET", "/user/myCompletedAuctions")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				auctions: response.data
			})
		}).catch(err => {
			displayError(err)
		})
	}

	componentDidMount() {
		if(!AuthHelper.isAdmin()) {
			return false
		}

	//	this.getAccounts()
		
	}


	render() {
		if(!AuthHelper.isAdmin()) {
			return (
				<AdminOnly />
			)
		}

		let pendingAccounts
		if(this.state.accounts) {
			pendingAccounts = this.state.accounts.map(item => {
				return (
					<AccountPreview />
				)
			})
		}
		else {
			pendingAccounts = []
		}

		return (
			<div>
				<HomeHeader history={this.props.history} />
				<Navbar auctionTab="active" />
				<div className="auction-managment">
					<AccountManagmentControl history={this.props.history} />
					<div className="auction-managment-myactivity">
						<h2 className="auction-managment-myactivity-title">Pending Registers</h2>
						<div>
							{pendingAccounts}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default PendingRegisters