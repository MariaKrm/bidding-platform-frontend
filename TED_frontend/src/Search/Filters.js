import React, { Component } from "react"

class Filters extends Component {
	constructor() {
		super()
		this.state = {
			lowerPrice: "",
			higherPrice: "",
			locationTitle: "",
			description: "",
			category: "",
			error: "",
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(event) {
		const { name, value } = event.target
		this.setState({
			[name]: value,
		})
	}

	handleSubmit(event) {
		event.preventDefault()
		let errorMessage = ""

		if(this.state.lowerPrice > this.state.higherPrice) {
			errorMessage = "Please enter a valid price range."
		}

		this.setState({
			error: errorMessage,
		})

		console.log("error: ", errorMessage)
    	if(errorMessage) return false


    	let redirectURL = "/home/filters?"
    	if(this.state.lowerPrice) {
    		redirectURL = redirectURL + "lowerPrice=" + this.state.lowerPrice + "&"
    	}
    	if(this.state.higherPrice) {
    		redirectURL = redirectURL + "higherPrice=" + this.state.higherPrice + "&"
    	}

    	redirectURL = redirectURL + "page=1"
    	this.props.history.push(redirectURL)

	}

	render() {
		return (
			<form>
				<br />
				<h5>Price Range</h5>
				<label>from:</label>
				<input
					className="filter-price"
					type="number"
					name="lowerPrice"
					value={this.state.lowerPrice}
					data-decimals="2"
					min={0}
					step="0.01"
					onChange={this.handleChange}
				/>
				<label>&nbsp;to:</label>
				<input
					className="filter-price"
					type="number"
					name="higherPrice"
					value={this.state.higherPrice}
					data-decimals="2"
					min={0}
					step="0.01"
					onChange={this.handleChange}
				/>

				<br />
				<br />
				<button type="submit" className="btn btn-success" onClick={this.handleSubmit}>Find Auctions</button>
			</form>
		)
	}
}

export default Filters