import React, { Component } from "react"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import AuctionPreview from "../Auction/AuctionPreview"
import PageWheel from "../Elements/PageWheel"

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
		this.getOpenAuctions = this.getOpenAuctions.bind(this)
		this.getFilteredAuctions = this.getFilteredAuctions.bind(this)
	}


	getOpenAuctions(currPage) {
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


	getFilteredAuctions(currPage, lowerPrice, higherPrice, locationTitle, description, category) {
		let filterRoute = "search/filters?"
		if(lowerPrice) {
			filterRoute = filterRoute + "lowerPrice=" + lowerPrice + "&"
		}
		if(higherPrice) {
			filterRoute = filterRoute + "higherPrice=" + higherPrice + "&"
		}
		if(locationTitle) {
			filterRoute = filterRoute + "locationTitle=" + locationTitle + "&"
		}
		if(description) {
			filterRoute = filterRoute + "description=" + description + "&"
		}
	/*
		if(category) {
			filterRoute = filterRoute + "?categoriesId=" + category
		}
	*/

		customRequest("GET", `${filterRoute}page=${currPage-1}&size=${this.state.itemsPerPage}`)
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
				auctions: response.data,
			})
		}).catch(err => {
            displayError(err)
		})
	}


	getAuctions() {
		console.log("AuctionsDisplay getAuctions")
		

		const query = new URLSearchParams(window.location.search)
		let currPage = query.get("page")

		if(currPage === null) {
			this.props.history.push("?page=1")
			currPage = 1
		}
		currPage = Number(currPage)

		const path = this.props.location.pathname
		const pos = path.lastIndexOf("/")
		const type = path.slice(pos+1)

		if(type === "filters") {
			const lowerPrice = query.get("lowerPrice")
			const higherPrice = query.get("higherPrice")
			const locationTitle = query.get("locationTitle")
			const description = query.get("description")
			const category = query.get("category")
			this.getFilteredAuctions(currPage, lowerPrice, higherPrice, locationTitle, description, category)
		}
		else {
			this.getOpenAuctions(currPage)
		}
	}

	componentDidUpdate(prevProps) {
        if(this.props.location.pathname !== prevProps.location.pathname) {
            this.getAuctions()
        }
    }

	componentDidMount() {
		this.getAuctions()
	}

	render() {
		
		let auctions
		if(this.state.auctions) {
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
					<button className="refresh-small" onClick={this.getOpenAuctions}>Refresh</button>
				</div>
				{auctions}
		{/*		<PageWheel activePage={this.state.currentPage} lastPage={this.state.lastPage} />*/}
			</div>
		)
	}
}


export default AuctionsDisplay