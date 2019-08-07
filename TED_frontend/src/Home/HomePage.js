import React, { Component } from "react"
import Header from "../Elements/Header"
import Timer from "./Timer"
import SearchBar from "../Search/SearchBar"
import Swal from "sweetalert2"
import AuthHelper, { request } from "../utils/AuthHelper"


class HomePage extends Component {
	constructor() {
		super()
		this.state = {
			poop: ""
		}
	}

	getAuctions() {
		console.log("getAuctions")
	//	axios.get(Constants.BASEURL + "/item/openAuctions", {headers: AuthHelper.getAuthHeader()} )
		request("GET", "/item/openAuctions")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)
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


	render() {
		this.getAuctions()
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