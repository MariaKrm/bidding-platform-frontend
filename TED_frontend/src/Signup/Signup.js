import React from "react"
import axios from "axios"
import { Redirect } from "react-router"
import * as Constants from "../Constants/Constants"
import Header from "../Elements/Header"
import { displayError } from "../utils/ErrorHelper"
import AddressForm from "../Address/AddressForm"
import ValidatedInput from "../Elements/ValidatedInput"


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
    	let errorMessage = ""

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
    		this.setState({
    			success: true,
    		})
            window.scrollTo(0, 0)
    		setTimeout(() => this.setState({ redirect: true }), 2000)
    	}).catch(err => {
    		displayError(err)
    	})

    }

    handleAddressSubmit(addressCoords, city, country) {
    	this.setState({
    		coords: addressCoords,
    		locationTitle: city + ", " + country
    	})
    }

    redirectToLogin() {
        if(this.state.redirect) {
            return <Redirect to="./login" />
        }
    }

    success() {
    	if(this.state.success) {
    		return (
    			<div className="alert alert-success">
    			  <strong>Success!</strong> Account Created. Redirecting to Login.
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
				<div className="signup-form-group">
                    <form className="signup-form" onSubmit={this.handleSubmit}>
                        {this.state.error && this.state.error !== "" && <div className="alert-danger"><strong>{this.state.error}</strong> </div>}
                        <h2>Sign Up</h2>
                        <br />
                        <ValidatedInput 
                            type="text"
                            value={this.state.username}
                            name="username" 
                            placeholder="Username" 
                            passresult={this.passresult}
                            required
                        />
                        <br />
                        <ValidatedInput 
                            type="password" 
                            value={this.state.password}
                            name="password" 
                            placeholder="Password" 
                            passresult={this.passresult}
                            required
                        />
                        <ValidatedInput 
                            type="password"
                            value={this.state.confirmPassword}
                            name="confirmPassword" 
                            placeholder="Confirm Password" 
                            passresult={this.passresult}
                            password={this.state.password}
                            required
                        />

                        <br />

                        <input 
                            type="text" 
                            value={this.state.firstName} 
                            name="firstName" 
                            placeholder="First Name" 
                            onChange={this.handleChange}
                            required
                        />
                        <input 
                            type="text" 
                            value={this.state.lastName} 
                            name="lastName" 
                            placeholder="Last Name" 
                            onChange={this.handleChange}
                            required
                        />

                        <br />
                        <ValidatedInput 
                            type="text"
                            value={this.state.email}
                            name="email" 
                            placeholder="Email" 
                            className="email-box"
                            passresult={this.passresult}
                            required
                        />

                        <br />
                        <ValidatedInput 
                            type="text" 
                            value={this.state.telNumber} 
                            name="telNumber" 
                            placeholder="Phone Number" 
                            passresult={this.passresult}
                            required
                        />

                        <input 
                            type="text" 
                            value={this.state.taxNumber} 
                            name="taxNumber" 
                            placeholder="TIN" 
                            onChange={this.handleChange}
                            required
                        />

                        <br />
                        <br />

                        <button className="btn btn-dark btn-margin btn-set-size">Sign Up</button>
                        
                    </form>

                    <AddressForm onAddressSubmit={this.handleAddressSubmit} />
                </div>
			</div>
		)
	}
}

export default Signup