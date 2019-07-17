import React, { Component } from "react";

import RegistrationForm from "./register.js";
import Header from "../Elements/Header";
import {NavLink, Redirect} from "react-router-dom";

class SuccessfulSignup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			secondsLeft: 30
		};

		this.interval = null;

		this.renderSeconds = this.renderSeconds.bind(this);
	}


	componentDidMount() {
		this.interval = setInterval(() => this.setState(state => ({ secondsLeft: state.secondsLeft - 1})), 1000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	renderSeconds() {
		const { secondsLeft: seconds } = this.state;
		if (seconds > 1) return `in ${seconds} seconds`;
		if (seconds === 1) return "in a second";
		return "now";
	}

	render() {
		const description = "An email as been sent to the email address you register with. Please follow the instructions described in the email.";
		return <div className='signup verify-email'>
			{this.state.secondsLeft < 0 && <Redirect to={"/profile"}/>}
			<Header title='Verify email' description={description}/>
			<form>
				<p>Haven&apos;t received an email yet? Click <NavLink to={"/settings"}>here</NavLink> to ask for a new one!</p>
				<div className='reset'>You will be redirected to your profile page {this.renderSeconds()}...</div>
			</form>
		</div>;
	}
}


export default class Signup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			submitted: false,
			email: ""
		};

		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(email) {
		this.setState({ email, submitted: true });
	}


	render() {
		return (this.state.submitted) ? <SuccessfulSignup/> : <RegistrationForm onSubmit={this.onSubmit}/>;
	}
}
