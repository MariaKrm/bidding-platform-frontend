import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import NotAvailable from "../utils/NotAvailable"
import HomeHeader from "../Elements/HomeHeader"
import Navbar from "../Elements/Navbar"
import AuctionManagmentControl from "./AuctionManagmentControl"
import AuctionPreview from "../Auction/AuctionPreview"
import PageWheel from "../Elements/PageWheel"

class ViewedAuctions extends Component {
	constructor() {
		super()
		this.state = {
			auctions: null,
			itemsPerPage: 5,
			currentPage: -1,
			lastPage: "",
		}

		this.getAuctions = this.getAuctions.bind(this)
	}

	getAuctions(currPage) {
		customRequest("GET", `/user/myHistory?page=${currPage-1}&size=${this.state.itemsPerPage}`)
		.then(response => {
			this.setState({
				lastPage: response.data.totalPages,
				currentPage: currPage,
				auctions: response.data.content,
			})
		}).catch(err => {
			displayError(err)
		})
	}

	componentDidMount() {
		//Stop if not logged in
		if(!AuthHelper.loggedIn()) {
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
		this.getAuctions(currPage)
	}

	render() {
		//Page only accessible by logged in users
		if(!AuthHelper.loggedIn()) {
			return (
				<NotAvailable />
			)
		}

		let myAuctions
		if(this.state.auctions) {
			myAuctions = this.state.auctions.map(item => {
				return (
					<AuctionPreview
						key={item.id}
						auction={item}
						history={this.props.history}
					/>
				)
			})
		}
		else {
			myAuctions = null
		}

		return (
			<div>
				<HomeHeader history={this.props.history} />
				<Navbar auctionTab="active" />
				<div className="managment-page">
					<AuctionManagmentControl history={this.props.history} />
					<div className="managment-content">
						<h2 className="managment-content-title">Viewed Auctions</h2>
						<div>
							{myAuctions}
							<PageWheel activePage={this.state.currentPage} lastPage={this.state.lastPage} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default ViewedAuctions