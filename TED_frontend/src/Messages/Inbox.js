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

	displayMessage(id) {
		//Mark message as seen
		const message = this.state.messages.find(x => x.id === id)
		customRequest("PATCH", `/user/markMessage/${message.id}`)
		.then(response => {
			this.setState({
				selected: message,
				show: "selected"
			})
		}).catch(err => {
			displayError(err)
		})
	}

	closeMessage() {
		this.setState({
			show: "all",
			selected: "",
		})
	}

	reply(id) {
		const message = this.state.messages.find(x => x.id === id)
		this.setState({
			show: "new",
			selected: message,
		})
	}


	getMessages(currPage) {
		customRequest("GET", `/user/receivedMessages?page=${currPage-1}&size=${this.state.itemsPerPage}`)
		.then(response => {
			this.setState({
				lastPage: response.data.totalPages,
				currentPage: currPage,
				messages: response.data.content,
			})
		}).catch(err => {
	//		displayError(err)
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

		//Get messages every 5 seconds
		this.intervalId = setInterval(() => {
			this.getMessages(currPage)
		}, 5000)

	}

	componentWillUnmount() {
		//Clear interval
		if(this.intervalId) {
			clearInterval(this.intervalId)
		}
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

		//Display all messages/selected message/new message
		let content
		if(this.state.show === "selected") {
			content =
				<div>
					<MessageDisplay 
						message={this.state.selected} 
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
			content = 
				<div>
					<NewMessage
						sender={this.state.selected.recipient}
						recipient={this.state.selected.sender}
						item={this.state.selected.item}
						message={this.state.selected.message}
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
				<div className="management-page">
					<MessageControl />
					<div className="management-content">
						<h2 className="management-content-title">Inbox</h2>
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