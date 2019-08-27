import React, { Component } from "react"
import AuthHelper from "../utils/AuthHelper"
import AuctionsDisplay from "./AuctionsDisplay"


class Feed extends Component {
	constructor() {
		super()

		this.newAuction = this.newAuction.bind(this)
		this.newCategory = this.newCategory.bind(this)
	}


	newAuction() {
		this.props.history.push("/createAuction")
	}

	newCategory() {
		this.props.history.push("/createCategory")
	}

	render() {
		return (
			<div className="home-content">
				<div className="search-container">
					<h3>Search</h3>
				{/*eslint-disable-next-line*/}
					<img src={require("../images/no_image.png")} alt="no image available" />
				</div>
				<div className="main-content">
{/*							<h3>Main Content</h3>
					<Timer />				{/* This is to test the refresh with timer; changes the time every 3 seconds */}
					<AuctionsDisplay history={this.props.history}/>
				</div>
				<div className="suggestions">
					<h3>Suggestions etc</h3>
					<div className="right-action-buttons">
						{AuthHelper.loggedIn() ? 
							<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.newAuction}>New Auction</button>
							: <button className="btn btn-success disabled btn-margin btn-set-size" disabled>New Auction</button>
						}

						<br />
						{AuthHelper.isAdmin() ?
							<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.newCategory}>New Category</button>
							: null
						}
					</div>
					<br />
					{/*eslint-disable-next-line*/}
					<img src={require("../images/no_image.png")} alt="no image available" />
				</div>
			</div>
		)
	}
}

export default Feed