import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";

import Submit from "../Elements/Submit";
import Header from "../Elements/Header";
import InputElement from "../Elements/Input";
import { request } from "../utils";
import PropTypes from "prop-types";
import Swal from "sweetalert2";


function ErrorDisplay(props) {
	if (props.error !== null && props.error !== "") {
		return (<div className='error'>
			{props.error}
		</div>);
	}
}

ErrorDisplay.propTypes = {
	error: PropTypes.string.isRequired
};

class RequestForm extends Component {
	renderError() {
		Swal.fire({
			type: "error",
			title: "Oops...",
			text: `${this.props.error.statusCode}: ${this.props.error.message}`,
		});
	}

	render() {
		const description = "If you have forgotten your password and need another access to your account, give us your email and we'll send you a confirmation link to reset your password.";
		return (<div className= 'firstPages'>
			<Fragment>
				{this.props.error && this.renderError()}
				<Header title='Password Reset' description={description}/>
				<form onSubmit={this.props.sendResetEmail}>
					<InputElement
						type="email"
						name="email"
						placeholder="Email"
						label="Email Address"
						onChange={this.props.onChange}
					/>
					<Submit enabled={true} value='Send Email'/>
					<div className='reset'>Back to <NavLink to='/login'>Login</NavLink></div>
				</form>
			</Fragment>
		</div>);
	}
}

RequestForm.propTypes = {
	error: PropTypes.object,
	sendResetEmail: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired
};

class RequestSent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			validData: false,
		};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
	}

	render() {
		const description = "An email to reset the account's password associated with the address you provided has been sent. Please insert the code provided in the email below.";
		return (<Fragment>
			<Header description={description}/>
			<form className='pin-submit' onSubmit={this.handleSubmit}>
				<p>You haven&apos;t received any email? <a href='/' className='email-resend' onClick={this.props.sendResetEmail}>Resend Email</a></p>
				<div className='reset'>Back to <NavLink to='/login'>Login</NavLink></div>
				<ErrorDisplay error={this.props.error}/>
			</form>
		</Fragment>);
	}
}

RequestSent.propTypes = {
	sendResetEmail: PropTypes.func.isRequired,
	error: PropTypes.string
};

export default class PasswordRequest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			lastSubmission: 0,
			error: null,
			submitted: false
		};

		this.minTime = 60000;

		this.sendResetEmail = this.sendResetEmail.bind(this);
		this.put = this.put.bind(this);
	}

	submitRequest() {
		request.send("POST", "/account/get-reset-password", { email: this.state.email })
			.then(res => res.data).then(() => {
				this.setState({ submitted: true, lastSubmission: Date.now() });
			})
			.catch(err => {
				const { response } = err;
				let message = response.data.text.split("");
				message[0] = message[0].toUpperCase();
				message = message.join("");
				const error = {
					statusCode: response.status,
					message
				};
				this.setState({ error });
				setTimeout(() => this.setState({ error: null }), 7500);
			});
	}

	sendResetEmail(event) {
		event.preventDefault();
		const timeDelta = Date.now() - this.state.lastSubmission;
		if (timeDelta > this.minTime) return this.submitRequest();
		this.setState({
			error: "Cannot send emails too quickly, please wait 1 minute."
		});
		setTimeout(() => this.setState({ error: null}), this.minTime - timeDelta);
	}

	put(key, value) {
		this.setState({
			[key]: value,
		});
	}


	render() {
		if (this.state.submitted) {
			return <RequestSent
				error={this.state.error}
				sendResetEmail={this.sendResetEmail}
			/>;
		}
		return <RequestForm
			error={this.state.error}
			onChange={this.put}
			sendResetEmail={this.sendResetEmail}
		/>;
	}
}

PasswordRequest.propTypes = {
};
