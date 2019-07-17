import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Redirect } from "react-router";

import Submit from "../Elements/Submit";
import Header from "../Elements/Header";
import ValidatedInput from "../Elements/Input/validated";
import { request } from "../utils";
import PropTypes from "prop-types";

export default class PasswordReset extends Component {
	constructor(props) {
		super(props);
		this.state = {
			password: "",
			confirmPassword: "",
			redirecting: false
		};

		this.token = PasswordReset.getToken(props.location.search);

		this.put = this.put.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.put = this.put.bind(this);
	}

	static getToken(query) {
		return query.slice(1).split("=")[1];
	}

	handleSubmit(event) {
		event.preventDefault();
		request.send("POST", "/account/reset-password", {
			newPassword: this.state.password,
			token: this.token
		}).then(() => {
			this.setState({ redirecting: true });
		});
	}

	put(key, value) {
		this.setState({
			[key]: value
		});
	}

	render() {
		const description = "Please insert your new password and make sure to keep it safe and stored somewhere.";
		const validData = (this.state.password !== "" && this.state.confirmPassword !== "");
		return <React.Fragment>
			{(!this.token || this.state.redirecting) && <Redirect to={"/login"}/>}
			<Header title='Password Reset' description={description}/>
			<form onSubmit={this.handleSubmit}>
				<ValidatedInput
					type="password"
					name="password"
					placeholder="New Password"
					onChange={this.put}
					label={"New Password"}
				/>
				<ValidatedInput
					type="password"
					name="confirmPassword"
					placeholder="Confirm Password"
					onChange={this.put}
					label={"Confirm New Password"}
					password={this.state.password}
				/>
				<Submit enabled={validData} value='Reset Password'/>
				<div className='reset'>Back to <NavLink to='/login'>Login</NavLink></div>
			</form>
		</React.Fragment>;
	}
}

PasswordReset.propTypes = {
	location : PropTypes.shape({
		search : PropTypes.string
	})
};
