import React, { Component } from "react";
import { Redirect } from "react-router";
import { NavLink } from "react-router-dom";
import { request } from "../utils";
import { assignUser, registerToken } from "../Redux/actions";
import { connect } from "react-redux";
import InputElement from "../Elements/Input";
import PropTypes from "prop-types";
import { ReactComponent as USILogo } from "./logo_black.svg";
import Swal from "sweetalert2";


const mapStateToProps = (state) => ({ user: state.user });

const mapDispatchToProps = dispatch => ({
	assignUser: user => dispatch(assignUser(user)),
	registerToken: token => dispatch(registerToken(token)),
});

class ConnectedLogin extends Component {

	constructor(props) {
		super(props);

		this.state = {
			userName: "",
			password: "",
		};

		this.loginButton = React.createRef();
		
		this.header = React.createRef();

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	componentDidMount() {
		window.onmousemove = (event) => {
			const logo = document.querySelector("#usi-logo svg");
			const { current: header } = this.header;
			const bbox = logo.getBoundingClientRect();
			const center = { x: bbox.x + bbox.width/2, y: bbox.y + bbox.height/2};
			const deltaX = event.x - center.x;
			const deltaY = event.y - center.y;
			let theta = Math.atan2(deltaY, deltaX);
			if (theta < 0) theta = (Math.PI*2)-Math.abs(theta);
			
			const maxDistances = {
				x: header.clientWidth-center.x,
				y: header.clientHeight-center.y
			};
			
			const relDist = {
				x: Math.abs(deltaX / maxDistances.x),
				y: Math.abs(deltaY / maxDistances.y)
			};
			
			const avgDist = (relDist.x + relDist.y)/2;
			
			const distance = 20*avgDist;
			
			const opacity = 0.75-(0.75*avgDist);
			
			const blur = 10*avgDist;
			
			const distances = {
				x: Math.cos(theta)*distance,
				y: Math.sin(theta)*distance
			};
			logo.style.filter = `drop-shadow(${-distances.x}px ${-distances.y}px ${blur}px rgba(0, 0, 0, ${opacity}))`;
		};
	}
	
	componentWillUnmount() {
		window.onmousemove = null;
	}
	
	handleChange(key, value) {
		this.setState({
			[key]: value
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		const { userName, password } = this.state;
		const isEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(userName);
		const data = (isEmail) ? { email: userName, password } : { userName, password };
		request.send("POST", "/auth/login", data).then(({ data }) => {
			const { token, user } = data;
			this.props.registerToken(token);
			this.props.assignUser(user);
		}).catch(err => {
			if (!err.response) return;
			Swal.fire({
				type: "error",
				title: "Oops...",
				text: `${err.response.status}: ${err.response.data.text}`,
				footer: "<a href='/reset'>Forgot your password?</a>&nbsp;<a href='/signup'>Don't have an account yet?</a>"
			});
		});
	}

	render() {
		if (this.props.user) {
			return <Redirect to='/'/>;
		}
		return <div className= 'firstPages'>
			<div className='login'>
				<div className='header'  ref={this.header}>
					<NavLink to={"/login"} id='usi-logo'>
						<USILogo/>
					</NavLink>
				</div>
				<form className='loginForm' onSubmit={this.handleSubmit}>
					<InputElement
						type="text"
						name="userName"
						placeholder="Username / Email"
						label="Username / Email"
						onChange={this.handleChange}
					/>
					<InputElement
						type="password"
						name="password"
						placeholder="Password"
						label="Password"
						onChange={this.handleChange}
					/>
					<input ref={this.loginButton} type="submit" value="Login"/>
					<div className='form-options'><NavLink to='/reset'>Forgot password?</NavLink> | <NavLink to='/signup'>Signup now</NavLink></div>
				</form>
			</div>
		</div>;
	}
}

const Login = connect(mapStateToProps, mapDispatchToProps)(ConnectedLogin);

ConnectedLogin.propTypes = {
	registerToken: PropTypes.func.isRequired,
	assignUser: PropTypes.func.isRequired,
	user: PropTypes.object
};

export default Login;
