import React from "react"
import Header from "../Elements/Header"
import SignupForm from "./SignupForm"
import axios from "axios"
import * as Constants from "../Constants/Constants"
import Swal from "sweetalert2"
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
    		alert("Signed up")
    	}).catch(err => {
    		console.log("error: ", err)
    		var errText = err.response ? err.response.status + ":" + err.response.data.text : err
    		Swal.fire({
    		    type: "error",
    		    title: "Oops...",
    		    text: errText,
    		})
    	})

    }

    handleAddressSubmit(addressCoords, city, country) {
    	this.setState({
    		coords: addressCoords,
    		locationTitle: city + ", " + country
    	})
    	console.log("Address: ", addressCoords, city, country)
    }

	render() {
		return (
			<div className="background">
				<Header />
				<SignupForm data={this.state} handleChange={this.handleChange} passresult={this.passresult} handleSubmit={this.handleSubmit} handleAddressSubmit={this.handleAddressSubmit} />
			</div>
		)
	}
}

export default Signup