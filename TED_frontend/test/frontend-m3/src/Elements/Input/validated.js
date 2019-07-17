import {Component} from "react";
import React from "react";
import {request} from "../../utils";
import PropTypes from "prop-types";

export default class InputElement extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: "",
			error: "",
			active: false,
		};
		
		this.input = React.createRef();
		
		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.checkEmailAvail = this.checkEmailAvail.bind(this);
		this.checkUsernameAvail = this.checkUsernameAvail.bind(this);
	}
 
	signal() {
		if (this.state.error) return this.props.onChange(this.props.name, "");
		this.props.onChange(this.props.name, this.state.value);
	}
 
	static validateName(value) {
		return (value.split(" ").length < 2) ? "Invalid full name" : null;
	}
 
	static validateUsername(value) {
		let regEx = /\S{6,}/;
		if (!regEx.test(value)) return "Must be 6+ characters long";
		regEx = /^\w{6,}$/;
		if (!regEx.test(value)) return "Can only contain alphanumeric symbols";
		if (/\s/.test(value)) return "Cannot contain whitespaces";
		if (value.length > 15) return "Max allowed length 15 characters";
		return null;
	}
 
	static validateEmail(value) {
		const regEx = /\S+@\S+\.\S+/;
		return (!regEx.test(value)) ? "Invalid email address" : null;
	}
 
	static validatePassword(value) {
		const regEx = /^(?=.*[A-z])(?=.*[0-9])(?=.{8,})/;
		return (!regEx.test(value)) ? "Password not strong enough" : null;
	}
 
	validateConfirm(value) {
		if (!this.props.password) return;
		return (this.props.password !== value) ? "Passwords do not match" : null;
	}
 
	validate(value) {
		switch (this.props.name) {
		case "fullName": return InputElement.validateName(value);
		case "userName": return InputElement.validateUsername(value);
		case "email": return InputElement.validateEmail(value);
		case "password": return InputElement.validatePassword(value);
		case "confirmPassword": return this.validateConfirm(value);
		default: return null;
		}
	}
 
	checkUsernameAvail(value) {
		request.send("GET", `/account/checkUsername?username=${value}`).catch(() => {
			this.setState({ error: "Username is already taken" }, () => {
				this.signal();
			});
		});
	}
	
	checkEmailAvail(value) {
		request.send("GET", `/account/checkEmail?email=${value}`).catch(() => {
			this.setState({ error: "Email already in use" }, () => {
				this.signal();
			});
		});
	}
	
	handleClick() {
		const { current: input } = this.input;
		input.focus();
	}
	
	handleFocus() {
		this.setState({ active: true});
	}
 
	handleBlur(event) {
		this.setState({ active: false});
		if (event.target.name === "userName") {
			this.checkUsernameAvail(event.target.value);
		}
		if (event.target.name === "email") {
			this.checkEmailAvail(event.target.value);
		}
		
	}
 
	handleChange(event) {
		let {value} = event.target;
		value = value.trim();
		const error = this.validate(value);
		this.setState({
			value,
			error
		}, this.signal);
	}
 
	decideClassname() {
		const { error } = this.state;
		if (!error) return "correct";
		if (error === "") return "";
		return "error";
	}
 
 
	render() {
		const activeClass = (this.state.active) ? "active" : "";
		return <div className={"field "+activeClass} onFocus={this.handleFocus} onBlur={this.handleBlur} onClick={this.handleClick}>
			<div className="input">
				<label>{this.props.label}:</label>
				<input
					className={this.decideClassname()}
					type={this.props.type}
					name={this.props.name}
					placeholder={this.props.placeholder}
					onChange={this.handleChange}
					ref={this.input}
					onBlur={this.handleBlur}
				/>
			</div>
			{this.state.error && this.state.error !== "" && <div className={"error"}>{this.state.error}</div>}
		</div>;
	}
}

InputElement.propTypes = {
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string,
	type: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	password: PropTypes.string
};
