import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import NotAvailable from "../utils/NotAvailable"
import Header from "../Elements/Header"
import AccountButtons from "../Elements/AccountButtons"
import MessageControl from "./MessageControl"
import NewMessage from "./NewMessage"


class NewMessagePage extends Component {
	constructor() {
		super()
		this.state = {
			item: null,
			isSeller: false,
		}

		this.toInbox = this.toInbox.bind(this)
		this.getAuctionData = this.getAuctionData.bind(this)
	}

	toInbox() {
		this.props.history.push("/messages/sent")
	}

	getAuctionData(id) {
		customRequest("GET", "/item/" + id)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)

			this.setState({
				item: response.data,
			})

			const auctionWinner = response.data.bids[0]
			const me = AuthHelper.me()
			if(me && auctionWinner && (auctionWinner.bidder.id === me.id || response.data.seller.id === me.id)) {
				this.setState({
					isSeller: response.data.seller.id === me.id,
				})
			}
			
		}).catch(err => {
			displayError(err)
		})
	}

	componentDidMount() {
		const path = this.props.location.pathname
		const pos = path.lastIndexOf("/")
		const id = path.slice(pos+1)
		this.getAuctionData(id)
	}


	render() {
		if(!AuthHelper.loggedIn()) {
			return (
				<NotAvailable />
			)
		}

		if(!this.state.item) {
			return (
				<div>
					Loading...
				</div>
			)
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
						<div>
							<NewMessage 
								sender={this.state.isSeller ? this.state.item.seller : this.state.item.bids[0].bidder}
								recipient={this.state.isSeller ? this.state.item.bids[0].bidder : this.state.item.seller}
								item={this.state.item}
								goBack={this.toInbox}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default NewMessagePage