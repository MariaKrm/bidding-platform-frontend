import React from "react"
import Header from "../Elements/Header"
import SignupForm from "./SignupForm"
import axios from "axios"
import { Redirect } from "react-router"
import * as Constants from "../Constants/Constants"
import { displayError } from "../utils/ErrorHelper"
import "../styles/form_style.css"


class Signup extends React.Component {

	constructor() {
		super()
		this.state = {
			username: "",
			password: "",
			confirmPassword: "",
			firstName: "",
			lastName: "",
			email: "",
			telNumber: "",
			taxNumber: "",
			coords: null,
			locationTitle: "",
			error: "",
			redirect: false,
			success: false,
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleAddressSubmit = this.handleAddressSubmit.bind(this)
		this.passresult = this.passresult.bind(this)
		this.success = this.success.bind(this)
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
    	var errorMessage = ""

    	if(this.state.coords === null) {
    		errorMessage = "You have to enter a valid address."
    	}

    	const errors = this.state.username === null || this.state.password === null || this.state.confirmPassword === null || this.state.email === null
    	if(errors) {
    		errorMessage = "Please fix the mistakes first."
    	}
    	
    	this.setState({
    		error: errorMessage
    	})
    	if (errorMessage !== "" && errorMessage !== null) return false

    	const newUser = {
    		username: this.state.username,
    		password: this.state.password,
    		firstName: this.state.firstName,
    		lastName: this.state.lastName,
    		email: this.state.email,
    		telNumber: this.state.telNumber,
    		taxNumber: this.state.taxNumber,
    		latitude: this.state.coords.lat,
    		longitude: this.state.coords.lon,
    		locationTitle: this.state.locationTitle,
    	}

    	console.log("Signing up with: ", newUser)

    	axios.post(Constants.BASEURL + "/auth/signup", newUser)
    	.then(response => {
    		console.log("response: ", response)
    		this.setState({
    			success: true,
    		})
    		setTimeout(() => this.setState({ redirect: true }), 3000)
    	}).catch(err => {
    		displayError(err)
    	})

    }

    handleAddressSubmit(addressCoords, city, country) {
    	this.setState({
    		coords: addressCoords,
    		locationTitle: city + ", " + country
    	})
    	console.log("Address: ", addressCoords, city, country)
    }

    redirectToLogin() {
        if(this.state.redirect) {
            return <Redirect to="./login" />
        }
    }

    success() {
    	if(this.state.success) {
    		return (
    			<div class="alert alert-success">
    			  <strong>Success!</strong> Auction Created. Redirecting to Login.
    			</div>
    		)
    	}
    }

	render() {
		return (
			<div className="background">
				{this.redirectToLogin()}
				<Header />
				{this.success()}
				<SignupForm data={this.state} handleChange={this.handleChange} passresult={this.passresult} handleSubmit={this.handleSubmit} handleAddressSubmit={this.handleAddressSubmit} />
			</div>
		)
	}
}

export default Signup