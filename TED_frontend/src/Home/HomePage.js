import React, { Component } from "react"
import Header from "../Elements/Header"
import Timer from "./Timer"
import SearchBar from "../Search/SearchBar"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import AuctionsDisplay from "./AuctionsDisplay"


class HomePage extends Component {
	constructor() {
		super()

		this.postTest = this.postTest.bind(this)
		this.categoryTest = this.categoryTest.bind(this)
		this.seeCategories = this.seeCategories.bind(this)
		this.onClickTest = this.onClickTest.bind(this)
		this.newAuction = this.newAuction.bind(this)
		this.newCategory = this.newCategory.bind(this)
		this.redirectToLogin = this.redirectToLogin.bind(this)
		
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
			media: require("../images/Items/brick150.png"),
			endsAt: "2021-09-26T01:30:00.000-04:00",
			description: "Once upon a time, a brick broke in half. This is the second half."
		}
		console.log("newItem: ", newItem)

		const formData = new FormData();
   		formData.append('file', "../images/Items/brick150.png");
		const pathWithParams = `/item?name=${newItem.name}&buyPrice=${newItem.buyPrice}&firstBid=${newItem.firstBid}
			&categoriesId=${newItem.categoriesId}&longitude=${newItem.longitude}&latitude=${newItem.latitude}
			&locationTitle=${newItem.locationTitle}&media=${newItem.fromData}
			&endsAt=${newItem.endsAt}&description=${newItem.description}`
		console.log("path: ", pathWithParams)
		customRequest("POST", pathWithParams, newItem)
		//customRequest("POST", "/item", newItem)
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
		}).catch(err => {
			displayError(err)
		})
	}

	categoryTest() {
		customRequest("POST", "/admin/newCategory?name=Things")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
		}).catch(err => {
			displayError(err)
		})
	}

	seeCategories() {
		customRequest("GET", "/item/allCategories")
		.then(response => {
			console.log("seeCategories response: ", response)
			console.log("response.data: ", response.data)
		}).catch(err => {
			displayError(err)
		})
	}

	onClickTest() {
		//this.categoryTest()
		this.seeCategories()
		this.postTest()
	}

	newAuction() {
		this.props.history.push("/createAuction");
	}

	newCategory() {
		this.props.history.push("/createCategory")
	}


	redirectToLogin() {
		this.props.history.push("/login")
	}

	displayVisitorSign() {
		if(!AuthHelper.loggedIn()) {
			return (
				<div class="alert alert-info">
    				You are logged in as a visitor. Sign up to access all features.
    			</div>
			)
		}
		else {
			return null
		}
	}

	displayAccountButton() {
		if(AuthHelper.loggedIn()) {
			return (
				<div className="home-header-actions">
					<button className="header-button">My Account</button>
				</div>
			)
		}
		else {
			return (
				<div className="home-header-actions">
					<button className="header-button" onClick={this.redirectToLogin}>Log In/Sign Up</button>
				</div>
			)
		}
	}


	render() {
		return (
			<div>
				<div className="home-header">
					<Header />
					<div className="home-header-search">
						<SearchBar />
					</div>
					{this.displayAccountButton()}
				</div>
				{this.displayVisitorSign()}

				<div className="home-content">
					<div className="search-container">
						<h3>Search</h3>
						<button onClick={this.categoryTest}>Add Test Category</button>
						<br />
						<button onClick={this.onClickTest}>Add Test Auction</button>
						<br />
						<br />
						<br />
					{/*eslint-disable-next-line*/}
						<img src={require("../images/no_image.png")} alt="no image available" />
					</div>
					<div className="main-content">
						<h3>Main Content</h3>
						<Timer />				{/* This is to test the refresh with timer; changes the time every 3 seconds */}
						<AuctionsDisplay />
					</div>
					<div className="suggestions">
						<h3>Suggestions etc</h3>
						<div className="right-action-buttons">
							{AuthHelper.loggedIn() ? 
								<button type="button" className="btn btn-success" onClick={this.newAuction}>New Auction</button>
								: <button className="btn btn-success disabled" onClick={this.newAuction} disabled>New Auction</button>
							}

							<br />
							<br />
							{AuthHelper.isAdmin() ?
								<button type="button" className="btn btn-success" onClick={this.newCategory}>New Category</button>
								: null
							}
						</div>
						<br />
						{/*eslint-disable-next-line*/}
						<img src={require("../images/no_image.png")} alt="no image available" />
					</div>
				</div>
			</div>
		)
	}
}

export default HomePage