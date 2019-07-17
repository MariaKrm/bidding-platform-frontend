import React, { Component } from "react";
import Header from "../Elements/Header";
import { Redirect } from "react-router";
import { request } from "../utils";
import RequestError from "../Elements/RequestError";
import ReactDOM from "react-dom";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

export default class Verification extends Component {
	constructor(props) {
		super(props);
		this.state = {
			verified: false,
			secondsLeft: 10,
			description: "Your email verification is being processed, please standy a few moments.",
			error: false,
			hasFailed: false,
			invalidToken: false
		};

		this.errorTTL = 7500;

		this.token = Verification.getToken(props.location.search);
		this.interval = null;

		this.sendToken = this.sendToken.bind(this);
		this.renderSeconds = this.renderSeconds.bind(this);
		this.resendEmail = this.resendEmail.bind(this);
	}

	static getToken(query) {
		return query.slice(1).split("=")[1];
	}

	componentDidMount() {
		this.sendToken();
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	handleError(err) {
		const error = {
			statusCode: err.status,
			message: err.data.text
		};
		this.setState({ error, hasFailed: true, description: "There was an issue processing your request. Please try again later." });
	}

	sendToken() {
		request.send("GET", `/account/confirm?token=${this.token}`).then(res => res.data).then(() => {
			this.setState({ verified: true, description: "Welcome onboard! Your email has been verified" });
			this.interval = setInterval(() => this.setState(state => ({ secondsLeft: state.secondsLeft - 1})), 1000);
		}).catch(err => {
			this.setState({ invalidToken: true }, () => this.handleError(err.response));
			setTimeout(() => this.setState({ error: null }), this.errorTTL);
		});
	}

	resendEmail() {
		request.send("GET", "account/resend-verify").then(() => {
			this.setState({ description: "A new email has been sent to you. Please follow its instructions." });
		}).catch(err => {
			this.handleError(err.response);
			setTimeout(() => this.setState({ error: null }), this.errorTTL);

		});
	}

	renderSeconds() {
		const { secondsLeft: seconds } = this.state;
		if (seconds > 1) return `in ${seconds} seconds`;
		if (seconds === 1) return "in a second";
		return "now";
	}

	renderError() {
		return ReactDOM.createPortal(
			<RequestError TTL={this.errorTTL} error={this.state.error}/>,
			document.body
		);
	}

	render() {
		if (this.state.invalidToken) return <div className={"signup"}>
			<Header title={"Email Verification"}/>
			<p>The token provided was not valid. Please <NavLink to={"/settings"}>verify your account</NavLink> by asking a new token and following the instructions.</p>
		</div>;
		return <div className='signup'>
			{this.state.secondsLeft < 0 && <Redirect to={"/profile"}/>}
			<Header title='Email Verification' description={this.state.description}/>
			<div className={"verification"}>
				{this.state.verified && <div className='reset'>You will be redirected in {this.renderSeconds()}...</div>}
				{this.state.hasFailed && <div>
					<button onClick={this.resendEmail}>Resend Email</button>
				</div>}
			</div>
			{this.state.error && this.renderError()}
		</div>;
	}
}

Verification.propTypes = {
	location : PropTypes.shape({
		search : PropTypes.string
	})
};
