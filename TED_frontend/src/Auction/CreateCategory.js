import React, { Component } from "react"
import Header from "../Elements/Header"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import AdminOnly from "../utils/AdminOnly"
import DropdownContainer from "../Elements/DropdownContainer"


class CreateCategory extends Component {
	constructor() {
		super()
		this.state = {
			categoryName: "",
            parentCategory: "",
            transformedCategories: null,
			success: false,
		}

		this.handleChange = this.handleChange.bind(this)
        this.handleSelectChange = this.handleSelectChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
        this.tranformCategoriesToTreeSelect = this.tranformCategoriesToTreeSelect.bind(this)
        this.getAllCategories = this.getAllCategories.bind(this)
		this.cancel = this.cancel.bind(this)
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
    	const {name, value} = event.target
    	this.setState({ [name]: value })	
    }

    handleSelectChange(currentNode, selectedNodes) {
        if(selectedNodes[0]) {
            this.setState({
                parentCategory: selectedNodes[0].value,
            })
        }
        else {
            this.setState({
                parentCategory: "",
            })
        }
    }

    handleSubmit(event) {
    	event.preventDefault()
    	customRequest("POST", `/admin/newCategory/${this.state.parentCategory}?name=${this.state.categoryName}`)
    	.then(response => {
    		console.log("response: ", response)
    		console.log("response.data: ", response.data)
    		this.setState({
    			success: true
    		})
    		window.scrollTo(0, 0)
    		setTimeout(() => this.props.history.goBack(), 2000)
    	}).catch(err => {
    		displayError(err)
    	})
    }

    cancel() {
    	this.props.history.goBack()
    }


    success() {
    	if(this.state.success) {
    		return (
    			<div class="alert alert-success">
    			  <strong>Success!</strong> Category Added. Redirecting...
    			</div>
    		)
    	}
    }

    componentDidMount() {
        this.getAllCategories()
    }

	render() {
        if(!AuthHelper.isAdmin()) {
            return (
                <AdminOnly />
            )
        }

        if(this.state.transformedCategories === null) {
            return (
                <div>Loading...</div>
            )
        }

		return (
			<div>
				<Header />
				{this.success()}
				<form className="new-category-form" onSubmit={this.handleSubmit}>
					{this.state.error && this.state.error !== "" && <div className="alert-danger"><strong>{this.state.error}</strong> </div>}
					<input 
						type="text" 
						value={this.state.categoryName} 
						name="categoryName" 
						placeholder="Category Name"
						onChange={this.handleChange}
						required
					/>
					<br />
					<br />
                    <div>
                        <h4 className="field-label">Pick a parent category</h4>
                        <DropdownContainer data={this.state.transformedCategories[0]} mode="radioSelect" onChange={this.handleSelectChange} required />
                    </div>
                    <br />

					<button type="submit" className="btn btn-dark btn-margin btn-set-size">Submit</button>
					<button type="button" className="btn btn-danger btn-margin btn-set-size" onClick={this.cancel}>Cancel</button>
				</form>
			</div>
		)
	}

}

export default CreateCategory