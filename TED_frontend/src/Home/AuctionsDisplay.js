import React, { Component } from "react"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import AuctionPreview from "../Auction/AuctionPreview"
import PageWheel from "../Elements/PageWheel"
//import testAuctions from "../testData/testItems.js"

class AuctionsDisplay extends Component {
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
		customRequest("GET", `/item/openAuctions?page=${currPage-1}&size=${this.state.itemsPerPage}`)
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
				auctions: response.data.content,
			})
		}).catch(err => {
            displayError(err)
		})
	}

	componentDidMount() {
		const query = new URLSearchParams(window.location.search)
		let currPage = query.get('page')

		if(currPage === null) {
			this.props.history.push("?page=1")
			currPage = 1
		}
		this.getAuctions(currPage)
	}

	render() {
	/*	var auctionList
		if(this.state.auctions) {
			auctionList = testAuctions.concat(this.state.auctions)
		}
		else {
			auctionList = testAuctions
		}*/

		let auctions
		if(this.state.auctions && this.state.lastPage) {
			auctions = this.state.auctions.map(item => {
				return (
					<AuctionPreview
						key={item.id}
						auction={item}
						history={this.props.history}
					/>
				)
			})
		}
		else if(this.state.auctions === "") {
			auctions = <div>Loading...</div>
		}
		else {
			auctions = <div><br />No Auctions</div>
		}
		

		return (
			<div>
				<div className="refresh-button-container">
					<button className="refresh-small" onClick={this.getAuctions}>Refresh</button>
				</div>
				{auctions}
				<PageWheel activePage={this.state.currentPage} lastPage={this.state.lastPage} />
			</div>
		)
	}
}


export default AuctionsDisplay