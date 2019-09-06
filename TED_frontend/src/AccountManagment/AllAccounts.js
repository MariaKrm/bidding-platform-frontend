import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import HomeHeader from "../Elements/HomeHeader"
import Navbar from "../Elements/Navbar"
import AdminOnly from "../utils/AdminOnly"
import AccountManagmentControl from "./AccountManagmentControl"
import AccountPreview from "../Account/AccountPreview"
import PageWheel from "../Elements/PageWheel"


class AllAccounts extends Component {
	constructor() {
		super()
		this.state = {
			accounts: null,
			itemsPerPage: 5,
			currentPage: -1,
			lastPage: "",
		}
	}


	getAccounts(currPage) {
		customRequest("GET", `/admin/allUsers?page=${currPage-1}&size=${this.state.itemsPerPage}`)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			if(!this.state.lastPage) {
				const lastPage = Math.ceil(response.data.totalElements / this.state.itemsPerPage)
				this.setState({
					lastPage: lastPage,
				})

			}
			this.setState({
				currentPage: currPage,
				accounts: response.data.content,
			})
		}).catch(err => {
			displayError(err)
		})
	}

	componentDidMount() {
		if(!AuthHelper.isAdmin()) {
			return false
		}

		const query = new URLSearchParams(window.location.search)
		let currPage = query.get('page')

		if(currPage === null) {
			this.props.history.push("?page=1")
			currPage = 1
		}

		this.getAccounts(currPage)
	}


	render() {
		if(!AuthHelper.isAdmin()) {
			return (
				<AdminOnly />
			)
		}

		let allAccounts
		if(this.state.accounts && this.state.currentPage) {
			allAccounts = this.state.accounts.map(item => {
				return (
					<AccountPreview key={item.id} account={item} history={this.props.history} />
				)
			})
		}
		else {
			allAccounts = <div>Loading...</div>
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
							<PageWheel activePage={this.state.currentPage} lastPage={this.state.lastPage} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default AllAccounts