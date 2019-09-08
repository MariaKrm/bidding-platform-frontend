import React, { Component } from "react"
import jsonxml from "jsontoxml"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import AuctionsDisplay from "./AuctionsDisplay"
import Filters from "../Search/Filters"


class Feed extends Component {
	constructor() {
		super()

		this.newAuction = this.newAuction.bind(this)
		this.newCategory = this.newCategory.bind(this)
		this.exportXML = this.exportXML.bind(this)
		this.exportJSON = this.exportJSON.bind(this)
	}


	newAuction() {
		this.props.history.push("/createAuction")
	}

	newCategory() {
		this.props.history.push("/createCategory")
	}

	exportXML() {
		customRequest("GET", "/item/allAuctions")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)

			const xmls = response.data.map(item => {
				let itemXML = jsonxml(item, {prettyPrint: true})
				itemXML = "<item>" + itemXML + "</item>"
				//itemXML = itemXML.replace("\n", "\n\t")	//doesn't work :/
				return itemXML
			})
			const xml = "<items>\n" + xmls.join("\n") + "\n</items>"

			const element = document.createElement("a");
			const file = new Blob([xml], {type: 'application/xml'});
			element.href = URL.createObjectURL(file);
			element.download = "auctions.xml";
			document.body.appendChild(element); // Required for this to work in FireFox
			element.click();

		}).catch(err => {
            displayError(err)
		})
	}

	exportJSON() {
		customRequest("GET", "/admin/allAuctions")
		.then(response => {
			console.log("response: ", response)
			console.log("response.data: ", response.data)

			const jsons = response.data.map(item => {
				let itemJSON = JSON.stringify(item)
				console.log("itemJSON:\n", itemJSON)
				return itemJSON
			})
			const json = jsons.join("\n")
			console.log("json:\n", json)

			const element = document.createElement("a");
			const file = new Blob([json], {type: "application/json"});
			element.href = URL.createObjectURL(file);
			element.download = "auctions.json";
			document.body.appendChild(element); // Required for this to work in FireFox
			element.click();

		}).catch(err => {
            displayError(err)
		})
	}

	render() {
		return (
			<div className="home-content">
				<div className="search-container">
					<h3>Filters</h3>
					<Filters history={this.props.history} />
				</div>
				<div className="main-content">
{/*							<h3>Main Content</h3>
					<Timer />				{/* This is to test the refresh with timer; changes the time every 3 seconds */}
					<AuctionsDisplay {...this.props} />
				</div>
				<div className="suggestions">
					<div className="right-action-buttons">
						{AuthHelper.loggedIn() ? 
							<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.newAuction}>New Auction</button>
							: <button className="btn btn-success disabled btn-margin btn-set-size" disabled>New Auction</button>
						}

						<br />
						{AuthHelper.isAdmin() ?
							<div>
								<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.newCategory}>New Category</button>
								<br />
								<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.exportXML}>Export All to XML</button>
								<br />
								<button type="button" className="btn btn-success btn-margin btn-set-size" onClick={this.exportJSON}>Export All to JSON</button>
							</div>
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