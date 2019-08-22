import React, { Component } from "react"
import Header from "../Elements/Header"
import { Redirect } from "react-router"
import { customRequest } from "../utils/AuthHelper"
import { displayError } from "../utils/ErrorHelper"


class CreateCategory extends Component {
	constructor() {
		super()
		this.state = {
			categoryName: "",
			redirect: false,
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
    		setTimeout(() => this.setState({ redirect: true }), 2000)
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
    			<div class="alert alert-success">
    			  <strong>Success!</strong> Category Added. Redirecting to Home.
    			</div>
    		)
    	}
    }

	render() {
		return (
			<div>
				{this.redirectToHome()}
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

					<button type="submit" className="submit-button">Submit</button>
					<button type="button" className="cancel-button" onClick={this.cancel}>Cancel</button>
				</form>
			</div>
		)
	}

}

export default CreateCategory