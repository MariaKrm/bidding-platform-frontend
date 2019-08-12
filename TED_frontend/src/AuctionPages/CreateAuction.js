import React, { Component } from "react"
import Header from "../Elements/Header"

class CreateAuction extends Component {
	constructor() {
		super()
		this.state = {
			title: "",
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(event) {
    	const {name, value} = event.target
    	this.setState({ [name]: value })	
    }

    handleSubmit(event) {
    	event.preventDefault()
    	console.log("Submited")
    }


	render() {
		return (
			<div>
				<Header />
				<form
					className="login-form" 
					onSubmit={this.handleSubmit}>
					<input 
						type="text" 
						value={this.state.title} 
						name="title" 
						placeholder="Title"
						onChange={this.handleChange}
						required
					/>
					<input 
						type="text" 
						value={this.state.title} 
						name="title" 
						placeholder="Title"
						onChange={this.handleChange}
						required
					/>
					<input 
						type="text" 
						value={this.state.title} 
						name="title" 
						placeholder="Title"
						onChange={this.handleChange}
						required
					/>
					<input 
						type="text" 
						value={this.state.title} 
						name="title" 
						placeholder="Title"
						onChange={this.handleChange}
						required
					/>
					<h6>Don't worry I'll fix this soon</h6>
				</form>
			</div>
		)
	}
}


export default CreateAuction