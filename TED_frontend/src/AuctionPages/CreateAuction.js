import React, { Component } from "react"
import Header from "../Elements/Header"
import { Redirect } from "react-router"
import DatePicker from "react-datepicker"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import ValidatedInput from "../Elements/ValidatedInput"
import AddressForm from "../Signup/AddressForm"

import "react-datepicker/dist/react-datepicker.css"

class CreateAuction extends Component {
	constructor() {
		super()
		const array = new Array(5)
		const now = new Date()
		const after30mins =  new Date(now.getTime() + 30*60000);
		this.state = {
			itemName: "",
			buyPrice: "",
			firstBid: "",
			endsAt: after30mins,
			coords: null,
			locationTitle: "",
			description: "",
			error: "",
			categories: array,
			categoryList: [],
			redirect: false,
			success: false,
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleSelectChange = this.handleSelectChange.bind(this)
		this.handleDateChange = this.handleDateChange.bind(this)
		this.handleImageClick = this.handleImageClick.bind(this)
		this.passresult = this.passresult.bind(this)
		this.getAllCategories = this.getAllCategories.bind(this)
		this.handleAddressSubmit = this.handleAddressSubmit.bind(this)
		this.cancel = this.cancel.bind(this)
	}

	handleChange(event) {
    	const {name, value} = event.target
    	this.setState({ [name]: value })	
    }

    handleSelectChange(event) {
    	const {name, value} = event.target
    	const i = parseInt(name)
    	this.setState(oldState => {
    		const newCategories = [...oldState.categories]
    		newCategories[i] = value
    		console.log("categories: ", newCategories)
    		return {
    			categories: newCategories
    		}
    	})
    }

    handleDateChange(date) {
    	this.setState({
    		endsAt: date
    	})
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

    handleAddressSubmit(addressCoords, city, country) {
    	this.setState({
    		coords: addressCoords,
    		locationTitle: city + ", " + country
    	})
    	console.log("Address: ", addressCoords, city, country)
    }


    getAllCategories() {
    	customRequest("GET", "/item/allCategories")
    	.then(response => {
    		console.log("seeCategories response: ", response)
    		console.log("response.data: ", response.data)
    		const categories = response.data
    		console.log("categories: ", categories)
    		this.setState({
    			categoryList: categories
    		})
    	}).catch(err => {
    		displayError(err)
    	})
    }


    handleSubmit(event) {
    	event.preventDefault()
    	var errorMessage = ""
    	console.log("Submited")
    	console.log("Final state: ", this.state)


    	if(this.state.coords === null) {
    		errorMessage = "You have to enter a valid address."
    	}

    	const selectedCategories = this.state.categories.filter(cat => cat !== undefined && cat !== "")
    	const uniqueCategories = [...new Set(selectedCategories)]
    	console.log("final cat: ", uniqueCategories)

    	if(!uniqueCategories || uniqueCategories.length < 1) {
    		errorMessage = "Pick at least one category."
    	}

    	const errors = this.state.name === null || this.state.buyPrice === null || this.state.firstBid === null
    	if(errors) {
    		errorMessage = "Please fix the mistakes first."
    	}
    	
    	this.setState({
    		error: errorMessage
    	})

    	console.log("error: ", errorMessage)
    	if(errorMessage !== "" && errorMessage !== null) return false

    	const javaDate = this.state.endsAt.toISOString()
    	console.log("javaDate: ", javaDate)


    	const newAuction = {
    		name: this.state.itemName,
    		buyPrice: this.state.buyPrice,
    		firstBid: this.state.firstBid,
    		endsAt: javaDate,
    		coords: this.state.coords,
    		locationTitle: this.state.locationTitle,
    		categoriesId: uniqueCategories.join(", "),
    		description: this.state.description
    	}


    	const pathWithParams = `/item?name=${newAuction.name}&buyPrice=${newAuction.buyPrice}&firstBid=${newAuction.firstBid}
    		&categoriesId=${newAuction.categoriesId}&longitude=${newAuction.coords.lon}&latitude=${newAuction.coords.lat}
    		&locationTitle=${newAuction.locationTitle}&media=${newAuction.fromData}
    		&endsAt=${newAuction.endsAt}&description=${newAuction.description}`

    	console.log("path: ", pathWithParams)


    	customRequest("POST", pathWithParams, newAuction)
    	.then(response => {
    		console.log("response: ", response)
    		console.log("response.data: ", response.data)
    		this.setState({
    			success: true,
    		})
    		setTimeout(() => this.setState({ redirect: true }), 3000)
    	}).catch(err => {
    		displayError(err)
    	})
    }


    cancel() {
    	this.setState({
    		redirect: true
    	})
    }


    redirectToHome() {
        if(this.state.redirect) {
            return <Redirect to="./home" />
        }
    }

    success() {
    	if(this.state.success) {
    		return (
    			<div className="alert alert-success">
    			  <strong>Success!</strong> Auction Created. Redirecting to Home.
    			</div>
    		)
    	}
    }

    componentWillMount() {
    	this.getAllCategories()
    }


	render() {
		const availableCategories = this.state.categoryList.map(item => {
			return (
				<option key={item.id} value={item.id}>{item.name}</option>
			)
		})
		return (
			<div>
				{this.redirectToHome()}
				<Header />
				{this.success()}
				<div className="new-auction-form-group">
					<form className="new-auction-form" onSubmit={this.handleSubmit}>
						{this.state.error && this.state.error !== "" && <div className="alert-danger"><strong>{this.state.error}</strong> </div>}
						{/*eslint-disable-next-line*/}
						<img className="add-image-picture" src={require("../images/add_image.png")} alt="Add image" onClick={this.handleImageClick} />
						<div className="new-auction-fields">
							<ValidatedInput 
								type="text" 
								value={this.state.name} 
								name="itemName"
								placeholder="Item Name"
								passresult={this.passresult}
								required
							/>
							<ValidatedInput
								type="text" 
								value={this.state.buyPrice} 
								name="buyPrice" 
								placeholder="Buy Price (ex. 12.00) €"
								passresult={this.passresult}
							/>
							<ValidatedInput
								type="text" 
								value={this.state.firstBid} 
								name="firstBid" 
								placeholder="First Bid"
								passresult={this.passresult}
								required
							/>

							<br />
							<div className="date-picker-container">
								<h4 className="field-label">Auction will end at:</h4>
								<DatePicker
									className="date-picker-field"
									selected={this.state.endsAt}
									onChange={this.handleDateChange}
									showTimeSelect
									timeFormat="HH:mm"
									timeIntervals={15}
									dateFormat="MMMM d, yyyy h:mm aa"
								/>
							</div>

							<div className="category-selector-container">
								<h3 className="info-title">Pick up to 5 categories</h3>
								<select className="category-selector" name={0} value={this.state.categories[0]} onChange={this.handleSelectChange}>
									<option defaultValue="" value="">-- Category 1 --</option>
									{availableCategories}
								</select>
								<select className="category-selector" name={1} value={this.state.categories[1]} onChange={this.handleSelectChange}>
									<option defaultValue="" value="">-- Category 2 --</option>
									{availableCategories}
								</select>
								<select className="category-selector" name={2} value={this.state.categories[2]} onChange={this.handleSelectChange}>
									<option defaultValue="" value="">-- Category 3 --</option>
									{availableCategories}
								</select>
								<select className="category-selector" name={3} value={this.state.categories[3]} onChange={this.handleSelectChange}>
									<option defaultValue="" value="">-- Category 4 --</option>
									{availableCategories}
								</select>
								<select className="category-selector" name={4} value={this.state.categories[4]} onChange={this.handleSelectChange}>
									<option defaultValue="" value="">-- Category 5 --</option>
									{availableCategories}
								</select>
							</div>

							<div className="description-container">
								<h4 className="field-label">Write a short description of the item</h4>
								<textarea name="description" className="description-input" value={this.state.description} onChange={this.handleChange} cols={40} rows={3} required />
							</div>
						</div>
						<button type="submit" className="submit-button">Submit</button>
						<button type="button" className="cancel-button" onClick={this.cancel}>Cancel</button>
					</form>
					<AddressForm onAddressSubmit={this.handleAddressSubmit} />
				</div>
			</div>
		)
	}
}


export default CreateAuction