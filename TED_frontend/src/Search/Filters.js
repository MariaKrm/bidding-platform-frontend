import React, { Component } from "react"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import DropdownContainer from "../Elements/DropdownContainer"

class Filters extends Component {
	constructor() {
		super()
		this.state = {
			lowerPrice: "",
			higherPrice: "",
			location: "",
			description: "",
			category: "",
			initialCategories: [],
            transformedCategories: null,
			error: "",
		}

		this.tranformCategoriesToTreeSelect = this.tranformCategoriesToTreeSelect.bind(this)
		this.getAllCategories = this.getAllCategories.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleSelectChange = this.handleSelectChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.clearFilters = this.clearFilters.bind(this)
	}

	//Transform the categories to the correct form for DropDownTreeSelect (in DropDownContainer)
	tranformCategoriesToTreeSelect(categories) {
	    let transCategories = categories.map(cat => {
	        return ({
	            label: cat.name,
	            value: cat.id,
	            children: this.tranformCategoriesToTreeSelect(cat.subcategories)
	        })
	    })

	    return transCategories
	}

	//Get all categories to display on dropdown
	getAllCategories() {
		customRequest("GET", "/item/allCategories")
		.then(response => {
			const categories = response.data
			this.setState({
				initialCategories: categories,
			})
	        let transCat = this.tranformCategoriesToTreeSelect([categories])
	        this.setState({
	            transformedCategories: transCat,
	        })
		}).catch(err => {
			displayError(err)
		})
	}

	handleChange(event) {
		const { name, value } = event.target
		this.setState({
			[name]: value,
		})
	}

	handleSelectChange(currentNode, selectedNodes) {
        if(selectedNodes[0]) {
            this.setState({
                category: selectedNodes[0].value,
            })
        }
        else {
            this.setState({
                category: "",
            })
        }
    }

	handleSubmit(event) {
		event.preventDefault()
		let errorMessage = ""

		if(this.state.lowerPrice && this.state.higherPrice && Number(this.state.lowerPrice) > Number(this.state.higherPrice)) {
			errorMessage = "Please enter a valid price range."
		}

		this.setState({
			error: errorMessage,
		})

		 //Do not allow submit if there are errors
    	if(errorMessage) return false


    	//Create url with filters
    	let redirectURL = "/home/filters?"
    	if(this.state.lowerPrice) {
    		redirectURL = redirectURL + "lowerPrice=" + this.state.lowerPrice + "&"
    	}
    	if(this.state.higherPrice) {
    		redirectURL = redirectURL + "higherPrice=" + this.state.higherPrice + "&"
    	}
    	if(this.state.location) {
    		redirectURL = redirectURL + "locationTitle=" + this.state.location + "&"
    	}
    	if(this.state.description) {
    		redirectURL = redirectURL + "description=" + this.state.description + "&"
     	}
     	if(this.state.category) {
     		redirectURL = redirectURL + "category=" + this.state.category + "&"
     	}

     	//If no filters redirect to home
     	if(!this.state.lowerPrice && !this.state.higherPrice && !this.state.location && !this.state.description && !this.state.category) {
     		redirectURL = "/home?"
     	}

     	//Show first page of filter results/home
    	redirectURL = redirectURL + "page=1"
    	this.props.history.push(redirectURL)

	}

	clearFilters() {
		this.setState({
			lowerPrice: "",
			higherPrice: "",
			location: "",
			description: "",
			category: "",
		})
	}

	componentDidMount() {
    	this.getAllCategories()
    }

	render() {
		//Wait for categories
		if(this.state.transformedCategories === null) {
		    return (
		        <div>Loading...</div>
		    )
		}

		return (
			<form className="filters">
				<h3>Filters</h3>
				{this.state.error && this.state.error !== "" && <div className="alert-danger"><strong>{this.state.error}</strong> </div>}
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
				<br />
				<input
					type="text"
					name="location"
					placeholder="Location"
					value={this.state.location}
					onChange={this.handleChange}
				/>

				<br />
				<br />

				<h5>Category</h5>
				<DropdownContainer data={this.state.transformedCategories[0]} mode="radioSelect" onChange={this.handleSelectChange} />

				<br />
				<br />
				<textarea
					className="description-input"
					type="text"
					name="description"
					placeholder="Description"
					value={this.state.description}
					onChange={this.handleChange}
				/>

				<br />
				<br />
				<button type="submit" className="btn btn-success btn-margin" onClick={this.handleSubmit}>Find Auctions</button>
				<button type="button" className="btn btn-success btn-margin" onClick={this.clearFilters}>Clear</button>
			</form>
		)
	}
}

export default Filters