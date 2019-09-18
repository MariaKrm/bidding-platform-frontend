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

	displayMessage(index) {
		this.setState({
			selected: index,
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
			messages = this.state.messages.map((item, index) => {
				return (
					<MessagePreview 
						key={item.id} 
						index={index} 
						message={item} 
						type="seen"
						history={this.props.history} 
						onClick={this.displayMessage} 
					/>
				)
			})
		}
		else {
			messages = <div>Loading...</div>
		}

		let content
		if(this.state.displayMessage) {
			content =
				<div>
					<MessageDisplay 
						index={this.state.selected}
						message={this.state.messages[this.state.selected]} 
						goBack={this.closeMessage} 
						reply={this.reply}
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
				<div className="managment-page">
					<MessageControl />
					<div className="managment-content">
						<h2 className="managment-content-title">Sent</h2>
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