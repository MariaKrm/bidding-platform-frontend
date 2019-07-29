import React from "react"
import Header from "../Header"
import SignupForm from "./SignupForm"
import "../styles/form_style.css"


class Signup extends React.Component {

	constructor() {
		super()
		this.state = {
			username: "",
			password: "",
			confirmPassword: "",
			firstname: "",
			lastname: "",
			email: "",
			phoneNumber: "",
			tin: "",
			coords: null,
			error: "",
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleAddressSubmit = this.handleAddressSubmit.bind(this)
		this.passresult = this.passresult.bind(this)
	}

	handleChange(event) {
    	const {name, value} = event.target
    	this.setState({ [name]: value })
    }

    passresult(name, value, error) {
    	if(error !== null) {
    		value = null
    	}
    	this.setState({
    		[name]: value,
    	})
    }

    handleSubmit(event) {
    	event.preventDefault()
    	const errors = this.state.username === null || this.state.password === null || this.state.confirmPassword === null || this.state.email === null
    	var errorMessage = ""
    	if(errors) {
    		errorMessage = "Please fix the mistakes first."
    	}
    	else if(this.state.coords === null) {
    		errorMessage = "You have to enter a valid address."
    	}
    	else {
    		alert("You signed up. Good Job " + this.state.username + "!\nYour coords are: " + this.state.coords.lat + ", " + this.state.coords.lon)
    	}
    	
    	this.setState({
    		error: errorMessage
    	})
    	return (errorMessage === "")
    }

    handleAddressSubmit(addressCoords) {
    	this.setState({
    		coords: addressCoords
    	})
    }

	render() {
		return (
			<div>
				<Header />
				<SignupForm data={this.state} handleChange={this.handleChange} passresult={this.passresult} handleSubmit={this.handleSubmit} handleAddressSubmit={this.handleAddressSubmit} />
			</div>
		)
	}
}

export default Signup