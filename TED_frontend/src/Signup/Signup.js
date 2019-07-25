import React from "react"
import Header from "../Header"
import SignupForm from "./SignupForm"

class Signup extends React.Component {

	constructor() {
		super()
		this.state = {
			username: "",
			password: "",
			repeatPassword: "",
			firstname: "",
			lastname: "",
			email: "",
			phoneNumber: "",
			tin: "",
			coords: null,

		}

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleAddressSubmit = this.handleAddressSubmit.bind(this)
	}

	handleChange(event) {
    	const {name, value} = event.target
    	this.setState({ [name]: value })
    	
    }

    handleSubmit(event) {
    	event.preventDefault()
    	if(this.state.password !== this.state.repeatPassword) {
    		alert("Passwords don't match.")
    		return false
    	}
    	else if(this.state.coords === null) {
    		alert("You have to enter a valid address.")
    		return false
    	}
    	else {
    		alert("You signed up. Good Job!\nYour coords are: " + this.state.coords.lat + ", " + this.state.coords.lon)
    		return true
    	}
    	
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
				<SignupForm data={this.state} handleChange={this.handleChange} handleSubmit={this.handleSubmit} handleAddressSubmit={this.handleAddressSubmit} />
			</div>
		)
	}
}

export default Signup