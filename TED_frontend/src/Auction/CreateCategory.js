import React, { Component } from "react"
import Header from "../Elements/Header"
import AuthHelper, { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"
import AdminOnly from "../utils/AdminOnly"


class CreateCategory extends Component {
	constructor() {
		super()
		this.state = {
			categoryName: "",
			success: false,
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.cancel = this.cancel.bind(this)
	}

	handleChange(event) {
    	const {name, value} = event.target
    	this.setState({ [name]: value })	
    }

    handleSubmit(event) {
    	event.preventDefault()
    	customRequest("POST", `/admin/newCategory?name=${this.state.categoryName}`)
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

	render() {
        if(!AuthHelper.isAdmin()) {
            return (
                <AdminOnly />
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

					<button type="submit" className="btn btn-dark btn-margin btn-set-size">Submit</button>
					<button type="button" className="btn btn-danger btn-margin btn-set-size" onClick={this.cancel}>Cancel</button>
				</form>
			</div>
		)
	}

}

export default CreateCategory