import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import NotAvailable from "../utils/NotAvailable"
import Header from "../Elements/Header"
import AccountButtons from "../Elements/AccountButtons"
import MessageControl from "./MessageControl"
import PageWheel from "../Elements/PageWheel"
import MessagePreview from "./MessagePreview"

class Inbox extends Component {
	constructor() {
		super()
		this.state = {
			messages: [],
			itemsPerPage: 20,
			currentPage: -1,
			lastPage: "",
		}

		this.getMessages = this.getMessages.bind(this)
	}


	getMessages(currPage) {
		customRequest("GET", `/user/receivedMessages?page=${currPage-1}&size=${this.state.itemsPerPage}`)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				lastPage: response.data.totalPages,
				currentPage: currPage,
				messages: response.data.content,
			})
		}).catch(err => {
			displayError(err)
		})
	}

	componentDidMount() {
		if(!AuthHelper.loggedIn()) {
			return false
		}

		const query = new URLSearchParams(window.location.search)
		let currPage = query.get('page')

		if(currPage === null) {
			this.props.history.push("?page=1")
			currPage = 1
		}

		currPage = Number(currPage)
		this.getMessages(currPage)

	}

	render() {
		if(!AuthHelper.loggedIn()) {
			return (
				<NotAvailable />
			)
		}

		let messages
		if(this.state.messages && this.state.currentPage) {
			messages = this.state.messages.map(item => {
				console.log("item: ", item)
				return (
					<MessagePreview key={item.id} message={item} history={this.props.history} />
				)
			})
		}
		else {
			messages = <div>Loading...</div>
		}

		return (
			<div className="messages">
				<div className="home-header">
					<Header />
					<AccountButtons history={this.props.history} />
				</div>
				<div className="managment-page">
					<MessageControl />
					<div className="managment-content">
						<h2 className="managment-content-title">Inbox</h2>
						<div>
							{messages}
							<PageWheel activePage={this.state.currentPage} lastPage={this.state.lastPage} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Inbox