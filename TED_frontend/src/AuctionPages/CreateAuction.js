import React, { Component } from "react"
import Header from "../Elements/Header"
import ValidatedInput from "../Elements/ValidatedInput"

class CreateAuction extends Component {
	constructor() {
		super()
		this.state = {
			title: "",
			buyPrice: "",
			firstBid: "",
			error: "",
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleImageClick = this.handleImageClick.bind(this)
		this.passresult = this.passresult.bind(this)
	}

	handleChange(event) {
    	const {name, value} = event.target
    	this.setState({ [name]: value })	
    }

    handleSubmit(event) {
    	event.preventDefault()
    	console.log("Submited")
    }

    handleImageClick() {
    	alert("Yay!")
    }

    passresult(name, value, error) {
    	if(error !== null) {
    		value = null
    	}
    	this.setState({
    		[name]: value,
    	})
    }


	render() {
		return (
			<div>
				<Header />
				<form
					className="new-auction-form" 
					onSubmit={this.handleSubmit}>
					<img className="add-image-picture" src={require("../images/add_image.png")} alt="Add image" onClick={this.handleImageClick} />
					<div className="new-auction-fields">
						<input 
							type="text" 
							value={this.state.title} 
							name="title" 
							placeholder="Title"
							onChange={this.handleChange}
							required
						/>
						<ValidatedInput
							type="text" 
							value={this.state.buyPrice} 
							name="buyPrice" 
							placeholder="Buy Price (ex. 12.00)"
							passresult={this.passresult}
							required
						/>
						<ValidatedInput
							type="text" 
							value={this.state.firstBid} 
							name="firstBid" 
							placeholder="First Bid"
							passresult={this.passresult}
							required
						/>
					</div>
					<h6>Don't worry I'll fix this soon</h6>
				</form>
			</div>
		)
	}
}


export default CreateAuction