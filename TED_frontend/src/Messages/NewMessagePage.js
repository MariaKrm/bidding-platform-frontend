import React, { Component } from "react"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import NotAvailable from "../utils/NotAvailable"
import Header from "../Elements/Header"
import AccountButtons from "../Elements/AccountButtons"
import MessageControl from "./MessageControl"
import NewMessage from "./NewMessage"

//Shown when "contact seller/top bidder" is pressed on AuctionPage
//Looks like NewMessage from reply on Inbox but has its own url
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
			this.setState({
				item: response.data,
			})

			//See if we are seller or top bidder of this auction
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
		//Get auction id from url
		const path = this.props.location.pathname
		const pos = path.lastIndexOf("/")
		const id = path.slice(pos+1)
		this.getAuctionData(id)
	}


	render() {
		//Page only accessible by logged in users
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
				<div className="management-page">
					<MessageControl />
					<div className="management-content">
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