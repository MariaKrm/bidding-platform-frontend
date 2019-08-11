import React, { Component } from "react"
import Header from "../Elements/Header"
import Timer from "./Timer"
import SearchBar from "../Search/SearchBar"
import Swal from "sweetalert2"
import { request } from "../utils/AuthHelper"
import AuctionPreview from "../Components/AuctionPreview"
import testAuctions from "./testItems.js"


class HomePage extends Component {
	constructor() {
		super()
		this.state = {
			openAuctions: null,
		}

		this.getAuctions = this.getAuctions.bind(this)
		this.postTest = this.postTest.bind(this)
		this.categoryTest = this.categoryTest.bind(this)
		this.seeCategories = this.seeCategories.bind(this)
		this.onClickTest = this.onClickTest.bind(this)
	}

	getAuctions() {
		console.log("getAuctions")
	//	axios.get(Constants.BASEURL + "/item/openAuctions", {headers: AuthHelper.getAuthHeader()} )
		request("GET", "/item/openAuctions")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.setState({
				openAuctions: response.data,
			})
		}).catch(err => {
            console.log(err)
            var errText = err.response ? err.response.status + ":" + err.response.data.text : err
            Swal.fire({
                type: "error",
                title: "Oops...",
                text: errText,
            })
		})
	}

	postTest() {
		const newItem = {
			name: "Half Brick",
			buyPrice: "50.0",
			firstBid: "12.5",
			categoriesId: "12530, 12598",
			longitude: "23.4555",
			latitude: "12.9090",
			locationTitle: "Trashcan",
			endsAt: "2021-09-26T01:30:00.000-04:00",
			description: "Once upon a time, a brick broke in half. This is the second half."
		}
		console.log("newItem: ", newItem)
		console.log("JSON newItem: ", JSON.stringify(newItem))

		const pathWithParams = `/item?name=${newItem.name}&buyPrice=${newItem.buyPrice}&firstBid=${newItem.firstBid}&categoriesId=${newItem.categoriesId}&longitude=${newItem.longitude}&latitude=${newItem.latitude}&locationTitle=${newItem.locationTitle}&endsAt=${newItem.endsAt}&description=${newItem.description}`
		console.log("path: ", pathWithParams)
		request("POST", pathWithParams, newItem)
		//request("POST", "/item", newItem)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
			this.getAuctions()
		}).catch(err => {
			console.log(err)
			var errText = err.response ? err.response.status + ":" + err.response.data.text : err
			Swal.fire({
			    type: "error",
			    title: "Oops...",
			    text: errText,
			})
		})
	}

	categoryTest() {
		request("POST", "/admin/newCategory?name=Debris")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
		}).catch(err => {
			console.log("cat")
			console.log(err)
			var errText = err.response ? err.response.status + ":" + err.response.data.text : err
			Swal.fire({
			    type: "error",
			    title: "Oops...",
			    text: errText,
			})
		})
	}

	seeCategories() {
		request("GET", "/item/allCategories")
		.then(response => {
			console.log("seeCategories response: ", response)
			console.log("response.data: ", response.data)
		}).catch(err => {
			console.log("cat")
			console.log(err)
			var errText = err.response ? err.response.status + ":" + err.response.data.text : err
			Swal.fire({
			    type: "error",
			    title: "Oops...",
			    text: errText,
			})
		})
	}

	onClickTest() {
		//this.categoryTest()
		this.seeCategories()
		this.postTest()
	}


	render() {
		var auctionList
		if(this.state.openAuctions) {
			auctionList = testAuctions.concat(this.state.openAuctions)
		}
		else {
			auctionList = testAuctions
		}
		
		const auctions = auctionList.map(item => {
			return (
				<AuctionPreview
					name={item.name}
					image={item.image} 
					alt_image={item.alt_image}
					buyPrice={item.buyPrice}
					current_price={item.current_price}
					endsAt={item.endsAt} 
					categories={item.categories} 
					location={item.location} 
					description={item.description}
				/>
			)
		})
		return (
			<div>
				<div className="home-header">
					<Header />
					<div className="home-header-search">
						<SearchBar />
					</div>
					<div className="home-header-actions">
						<button className="header-button">My Account</button>
					</div>
				</div>

				<div className="home-content">
					<div className="search-container">
						<h3>Search</h3>
					</div>
					<div className="main-content">
						<h3>Main Content</h3>
						<Timer />				{/* This is to test the refresh with timer; changes the time every 3 seconds */}
						{auctions}
					</div>
					<div className="suggestions">
						<h3>Suggestions etc</h3>
						<button onClick={this.categoryTest}>Add Test Category</button>
						<br />
						<button onClick={this.onClickTest}>Add Test Auction</button>
					</div>
				</div>
			</div>
		)
	}
}

export default HomePage