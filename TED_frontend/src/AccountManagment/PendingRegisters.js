import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import HomeHeader from "../Elements/HomeHeader"
import Navbar from "../Elements/Navbar"
import AdminOnly from "../utils/AdminOnly"
import AccountManagmentControl from "./AccountManagmentControl"
import AccountPreview from "../Account/AccountPreview"
import PageWheel from "../Elements/PageWheel"


class PendingRegisters extends Component {
	constructor() {
		super()
		this.state = {
			accounts: "",
			itemsPerPage: 5,
			currentPage: -1,
			lastPage: "",
		}

	}

	getAccounts(currPage) {
		customRequest("GET", `/admin/pendingRegisters?page=${currPage-1}&size=${this.state.itemsPerPage}`)
		.then(response => {
			this.setState({
				lastPage: response.data.totalPages,
				currentPage: currPage,
				accounts: response.data.content,
			})
		}).catch(err => {
			displayError(err)
		})
	}

	componentDidMount() {
		//Stop if not admin
		if(!AuthHelper.isAdmin()) {
			return false
		}

		//Deal with page parameters
		const query = new URLSearchParams(window.location.search)
		let currPage = query.get('page')

		//If no page is specified default to page 1
		if(currPage === null) {
			this.props.history.push("?page=1")
			currPage = 1
		}
		
		currPage = Number(currPage)
		this.getAccounts(currPage)
	}


	render() {
		//Page only accessible by admin
		if(!AuthHelper.isAdmin()) {
			return (
				<AdminOnly />
			)
		}

		let pendingAccounts
		if(this.state.accounts && this.state.currentPage) {
			pendingAccounts = this.state.accounts.map(item => {
				return (
					<AccountPreview key={item.id} account={item} history={this.props.history} />
				)
			})
		}
		else{
			pendingAccounts = <div>Loading...</div>
		}

		return (
			<div>
				<HomeHeader history={this.props.history} />
				<Navbar accountTab="active" />
				<div className="managment-page">
					<AccountManagmentControl history={this.props.history} />
					<div className="managment-content">
						<h2 className="managment-content-title">Pending Registers</h2>
						<div>
							{pendingAccounts}
							<PageWheel activePage={this.state.currentPage} lastPage={this.state.lastPage} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default PendingRegisters