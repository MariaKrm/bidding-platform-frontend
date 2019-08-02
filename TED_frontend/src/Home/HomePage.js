import React, { Component } from "react"
import Header from "../Elements/Header"
import Timer from "./Timer"
import SearchBar from "../Search/SearchBar"


class HomePage extends Component {
	constructor() {
		super()
		this.state = {
			poop: ""
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
					</div>
					<div className="suggestions">
						<h3>Suggestions etc</h3>
					</div>
				</div>
			</div>
		)
	}
}

export default HomePage