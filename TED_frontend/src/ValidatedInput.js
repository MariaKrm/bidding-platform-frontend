import React, { Component } from "react"


class ValidatedInput extends Component {
	constructor(props) {
		super(props)
		this.state = {
			value: "",
			error: "",
		}
		this.handleChange = this.handleChange.bind(this)
		this.validate = this.validate.bind(this)
		this.validateUsername = this.validateUsername.bind(this)
		this.validatePassword = this.validatePassword.bind(this)
		this.validateConfirm = this.validateConfirm.bind(this)
		this.validateEmail = this.validateEmail.bind(this)
	}


	validate(value) {
		switch (this.props.name) {
			case "username": return this.validateUsername(value);
			case "email": return this.validateEmail(value);
			case "password": return this.validatePassword(value);
			case "confirmPassword": return this.validateConfirm(value);
			default: return null;
		}
	}

	validateUsername(value) {
		let regEx = /\S{6,}/;
		if (!regEx.test(value)) return "Must be 6+ characters long";
		regEx = /^\w{6,}$/;
		if (!regEx.test(value)) return "Can only contain alphanumeric symbols";
		if (/\s/.test(value)) return "Cannot contain whitespaces";
		if (value.length > 15) return "Max allowed length 15 characters";
		return null;
	}
	validateEmail(value) {
		const regEx = /\S+@\S+\.\S+/;
		return (!regEx.test(value)) ? "Invalid email address" : null;
	}
 
	validatePassword(value) {
		const regEx = /^(?=.*[A-z])(?=.*[0-9])(?=.{8,})/;
		return (!regEx.test(value)) ? "Password not strong enough" : null;
	}
 
	validateConfirm(value) {
		return (this.props.password !== value) ? "Passwords do not match" : null;
	}


	handleChange(event) {
    	const {name, value} = event.target
    	const error = this.validate(value);
    	this.setState({
    		value: value,
    		error: error,
    	})
    	this.props.passresult(name, value, error)
    }


	render() {
		return (
			<div>
				<input
					type={this.props.type}
					name={this.props.name}
					placeholder={this.props.placeholder}
					required={this.props.required}
					value={this.state.value}
					onChange={this.handleChange}
				/>
				{this.state.error && this.state.error !== "" && <div className="field-error-message">{this.state.error} </div>} 
			</div>
		)
	}
}


export default ValidatedInput