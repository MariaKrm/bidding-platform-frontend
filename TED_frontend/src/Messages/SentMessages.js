import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import NotAvailable from "../utils/NotAvailable"
import Header from "../Elements/Header"
import AccountButtons from "../Elements/AccountButtons"
import MessageControl from "./MessageControl"
import PageWheel from "../Elements/PageWheel"
import MessagePreview from "./MessagePreview"
import MessageDisplay from "./MessageDisplay"

class SentMessages extends Component {
	constructor() {
		super()
		this.state = {
			messages: [],
			itemsPerPage: 20,
			currentPage: -1,
			lastPage: "",
			displayMessage: false,
			selected: "",
		}

		this.displayMessage = this.displayMessage.bind(this)
		this.closeMessage = this.closeMessage.bind(this)
		this.getMessages = this.getMessages.bind(this)
	}

	displayMessage(id) {
		const message = this.state.messages.find(x => x.id === id)
		this.setState({
			selected: message,
			displayMessage: true,
		})
	}

	closeMessage() {
		this.setState({
			displayMessage: false,
		})
	}

	getMessages(currPage) {
		customRequest("GET", `/user/sentMessages?page=${currPage-1}&size=${this.state.itemsPerPage}`)
		.then(response => {
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
		this.getMessages(currPage)

		//No need to refresh messages every now and then
	}

	render() {
		//Page only accessible by logged in users
		if(!AuthHelper.loggedIn()) {
			return (
				<NotAvailable />
			)
		}

		let messages
		if(this.state.messages && this.state.currentPage) {
			messages = this.state.messages.map(item => {
				return (
					<MessagePreview 
						key={item.id} 
						message={item} 
						type="seen"
						history={this.props.history} 
						onClick={this.displayMessage}
						sent 
					/>
				)
			})
		}
		else {
			messages = <div>Loading...</div>
		}

		//Display all messages/selected message
		let content
		if(this.state.displayMessage) {
			content =
				<div>
					<MessageDisplay 
						message={this.state.selected} 
						goBack={this.closeMessage} 
						sent
					/>
				</div>
		}
		else {
			content = 
				<div>
					{messages}
					<PageWheel activePage={this.state.currentPage} lastPage={this.state.lastPage} />
				</div>
		}

		return (
			<div className="messages">
				<div className="home-header">
					<Header />
					<AccountButtons history={this.props.history} />
				</div>
				<div className="management-page">
					<MessageControl />
					<div className="management-content">
						<h2 className="management-content-title">Sent</h2>
						<div>
							{content}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default SentMessages