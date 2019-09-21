import React, { Component } from "react"
import axios from "axios"
import { displayError } from "../utils/ErrorHelper"
import * as Constants from "../Constants/Constants"

//For input forms, check input and show appropriate error message under field
class ValidatedInput extends Component {
	constructor(props) {
		super(props)
		this.state = {
			value: props.value,
			error: "",
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleBlur = this.handleBlur.bind(this)
		this.checkUsernameAvail = this.checkUsernameAvail.bind(this)
		this.checkEmailAvail = this.checkEmailAvail.bind(this)
	}


	validate(value) {
		switch (this.props.name) {
			case "username": return this.validateUsername(value)
			case "email": return this.validateEmail(value)
			case "password": return this.validatePassword(value)
			case "confirmPassword": return this.validateConfirm(value)
			case "telNumber" : return this.validateTelNumber(value)
			case "buyPrice" : return this.validatePrice(value)
			case "firstBid" : return this.validatePrice(value)
			case "itemName" : return this.validateItemName(value)
			default: return null
		}
	}

	validateUsername(value) {
		let regEx = /\S{6,}/
		if (!value) return null
		if (!regEx.test(value)) return "Must be 6+ characters long"
		regEx = /^\w{6,}$/
		if (!regEx.test(value)) return "Can only contain alphanumeric symbols"
		if (/\s/.test(value)) return "Cannot contain whitespaces"
		if (value.length > 15) return "Max allowed length 15 characters"
		return null
	}

	validateEmail(value) {
		const regEx = /\S+@\S+\.\S+/
		return (value && !regEx.test(value)) ? "Invalid email address" : null
	}
 
	validatePassword(value) {
		const regEx = /^(?=.*[A-z])(?=.*[0-9])(?=.{8,})/
		return (value && !regEx.test(value)) ? "Password not strong enough" : null
	}
 
	validateConfirm(value) {
		return (value && this.props.password !== value) ? "Passwords do not match" : null
	}

	validateTelNumber(value) {
		const regEx = /^[0-9]\d{9,11}$/
		return (value && !regEx.test(value)) ? "Invalid number" : null
	}

	validatePrice(value) {
		const regEx = /(^[1-9]\d*$)|(^\d+\.\d{1,2}$)/
		return (value && !regEx.test(value)) ? "Invalid price" : null
	}

	validateItemName(value) {
		return value.length > 50 ? "Item name too long" : null
	}

	checkUsernameAvail(value) {
		axios.get(Constants.BASEURL + `/account/checkUsername?username=${value}`)
		.catch(err => {
			if(err.response && err.response.status === 400) {
				const error = "Username is already taken"
				this.setState({ error: error })
				this.props.passresult("username", value, error)
			}
			else {
				displayError(err)
			}
		})
	}

	checkEmailAvail(value) {
		axios.get(Constants.BASEURL + `/account/checkEmail?email=${value}`)
		.catch(err => {
			if(err.response && err.response.status === 400) {
				const error = "Email already in use"
				this.setState({ error: error })
				this.props.passresult("email", value, error)
			}
			else {
				displayError(err)
			}
		})
	}


	handleChange(event) {
    	const {name, value} = event.target
    	const error = this.validate(value)
    	this.setState({
    		value: value,
    		error: error,
    	})
    	this.props.passresult(name, value, error)
    }

    //Check for availability only when done typing
    handleBlur(event) {
    	const { name, value } = event.target
		if(name === "username") {
			this.checkUsernameAvail(value)
			this.props.passresult(name, value, this.state.error)
		}
		if(name === "email") {
			this.checkEmailAvail(value)
			this.props.passresult(name, value, this.state.error)
		}
		
	}

	//Don't submit form with enter on username and email to check for availability
	handleKeyPress(event){
   		if((event.target.name === "username" || event.target.name === "email") && event.keyCode === 13){
    		event.target.blur()
  		}
	}


	render() {
		return (
			<div>
				<input
					type={this.props.type}
					name={this.props.name}
					placeholder={this.props.placeholder}
					required={this.props.required}
					className={this.props.className}
					value={this.state.value}
					onChange={this.handleChange}
					onBlur={this.handleBlur}
					onKeyDown={this.handleKeyPress}
				/>
				{this.state.error && this.state.error !== "" && <div className="field-error-message">{this.state.error} </div>} 
			</div>
		)
	}
}


export default ValidatedInput