import React, {Component} from "react";

import {NavLink, Redirect} from "react-router-dom";
import Submit from "../Elements/Submit";
import Header from "../Elements/Header";
import {request, capitalize} from "../utils";
import ValidatedInput from "../Elements/Input/validated";
import { connect } from "react-redux";
import {assignUser, registerToken} from "../Redux/actions";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const mapStateToProps = state => ({ user: state.user });

const mapDispatchToProps = dispatch => ({
	assignUser: user => dispatch(assignUser(user)),
	registerToken: token => dispatch(registerToken(token))
});

class ConnectedRegistrationForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userName: "",
			fullName: "",
			email: "",
			password: "",
			confirmPassword: "",
		};

		this.loggedUser = props.user;

		this.handleSubmit = this.handleSubmit.bind(this);
		this.put = this.put.bind(this);
	}

	put(key, value) {
		this.setState({
			[key]: value
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		const { fullName, userName, email, password } = this.state;
		const [ firstName, lastName ] =  fullName.split(" ", 2).map(x => x.trim());
		request.send("POST", "/auth/signup", { firstName, lastName, userName, email, password }).then(res => {
			const { user, token } = res.data;
			this.props.assignUser(user);
			this.props.registerToken(token);
			let timerInterval;
			request.send("GET", "/auth/chatkitToken").then(res => res.data.token).then(token => {
				return request.send("POST", "https://us1.pusherplatform.io/services/chatkit/v4/74f281ff-4e67-4e28-9d19-1d9e9bbd5293/users", {
					id: userName,
					name: `${firstName} ${lastName}`
				}, {
					Authorization: "Bearer "+token
				});
			});
			// .catch(() => {
			// 	Swal.fire({
			// 		type: "error",
			// 		title: "Oops...",
			// 		text: "Couldn't link your profile to our chat system!",
			// 	});
			// });
			Swal.fire({
				type: "success",
				title: "Profile Created",
				text: "Your profile has been successfully created!",
				timer: 3000,
				onClose: () => {
					clearInterval(timerInterval);
					this.setState({ redirecting: true });
					
				}
			});
			this.props.onSubmit(this.state.email);
		}).catch(err => {
			const { response } = err;
			if (!response) return;
			Swal.fire({
				type: "error",
				title: "Oops...",
				text: `${response.status}: ${capitalize(response.data.text)}`,
			});
		});
	}


	render() {
		const enableSubmit = Object.values(this.state).reduce((result, x) => result && (x !== ""), true);
		return <div className= 'firstPages'>
			<div className='signup'>
				{this.loggedUser && <Redirect to={"/"}/>}
				<Header title='Signup'/>
				<form onSubmit={this.handleSubmit}>
					<ValidatedInput
						type='text'
						name='fullName'
						placeholder='Full Name'
						onChange={this.put}
						label="Full name"
					/>
					<ValidatedInput
						type='text'
						name='userName'
						placeholder='Username'
						onChange={this.put}
						label="Username"
					/>
					<ValidatedInput
						type='email'
						name='email'
						placeholder='Email'
						onChange={this.put}
						label="Email address"
					/>
					<ValidatedInput
						type='password'
						name='password'
						placeholder='Password'
						onChange={this.put}
						label="Password"
					/>
					<ValidatedInput
						type='password'
						name='confirmPassword'
						placeholder='Confirm Password'
						onChange={this.put}
						label="Confirm Password"
						password={this.state.password}
					/>
					<Submit enabled={enableSubmit} value='Signup'/>
					<div className='reset'>Back to <NavLink to='/login'>Login</NavLink></div>
				</form>
			</div>
		</div>;
	}
}

const RegistrationForm = connect(mapStateToProps, mapDispatchToProps)(ConnectedRegistrationForm);

export default RegistrationForm;

ConnectedRegistrationForm.propTypes = {
	user : PropTypes.string,
	assignUser : PropTypes.func.isRequired,
	registerToken : PropTypes.func.isRequired,
	onSubmit : PropTypes.func.isRequired
};
