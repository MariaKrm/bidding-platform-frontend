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
	}

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


	getAllCategories() {
		customRequest("GET", "/item/allCategories")
		.then(response => {
	        console.log("response: ", response)
	        console.log("response.data: ", response.data)
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

		if(Number(this.state.lowerPrice) > Number(this.state.higherPrice)) {
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
    	if(this.state.location) {
    		redirectURL = redirectURL + "locationTitle=" + this.state.location + "&"
    	}
    	if(this.state.description) {
    		redirectURL = redirectURL + "description=" + this.state.description + "&"
     	}
     	if(this.state.category) {
     		redirectURL = redirectURL + "category=" + this.state.category + "&"
     	}

     	if(!this.state.lowerPrice && !this.state.higherPrice && !this.state.location && !this.state.description && !this.state.category) {
     		redirectURL = "/home?"
     	}

    	redirectURL = redirectURL + "page=1"
    	this.props.history.push(redirectURL)

	}

	componentDidMount() {
    	this.getAllCategories()
    }

	render() {
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

				<DropdownContainer data={this.state.transformedCategories[0]} mode="radioSelect" onChange={this.handleSelectChange} required />

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
				<button type="submit" className="btn btn-success" onClick={this.handleSubmit}>Find Auctions</button>
			</form>
		)
	}
}

export default Filters