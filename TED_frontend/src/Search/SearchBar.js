import React, { Component } from "react"

class SearchBar extends Component {

	constructor() {
		super()
		this.state = {
			text: ""
		}

		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		console.log("poop")
	}

	handleSubmit(event) {
		event.preventDefault()
		console.log("poopoop")
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<input
					type="text"
					className="search-bar"
					placeholder="Search"
					onChange={this.handleChange}
				 />
				 <button className="main-button" type="submit">
				 	Search
				 </button>
			</form>
		)
	}
}

export default SearchBar