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
import NewMessage from "./NewMessage"

class Inbox extends Component {
	constructor() {
		super()
		this.state = {
			messages: [],
			itemsPerPage: 20,
			currentPage: -1,
			lastPage: "",
			show: "all",
			selected: "",
		}

		this.displayMessage = this.displayMessage.bind(this)
		this.closeMessage = this.closeMessage.bind(this)
		this.reply = this.reply.bind(this)
		this.getMessages = this.getMessages.bind(this)
	}

	displayMessage(index) {
		customRequest("PATCH", `/user/markMessage/${this.state.messages[index].id}`)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
		}).catch(err => {
			displayError(err)
		})

		this.setState({
			selected: index,
			show: "selected"
		})
	}

	closeMessage() {
		this.setState({
			show: "all",
			selected: "",
		})
	}

	reply(index) {
		this.setState({
			show: "new",
			selected: index,
		})
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
			messages = this.state.messages.map((item, index) => {
				return (
					<MessagePreview 
						key={item.id} 
						index={index} 
						message={item} 
						type={item.seen ? "seen" : "unseen"}
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
		if(this.state.show === "selected") {
			content =
				<div>
					<MessageDisplay 
						index={this.state.selected}
						message={this.state.messages[this.state.selected]} 
						goBack={this.closeMessage} 
						reply={this.reply}
					/>
				</div>
		}
		else if(this.state.show === "all") {
			content = 
				<div>
					{messages}
					<PageWheel activePage={this.state.currentPage} lastPage={this.state.lastPage} />
				</div>
		}
		else {
			const message = this.state.messages[this.state.selected]
			content = 
				<div>
					<NewMessage
						sender={message.sender}
						recipient={message.recipient}
						item={message.item}
						message={message.message}
						goBack={this.closeMessage}
						reply
					/>
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
						<h2 className="managment-content-title">Inbox</h2>
						<div>
							{content}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Inbox