import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SeePassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false,

		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(){
		this.setState((state)=>({
			isVisible: !state.isVisible
		}));
	}

	render() {
		const type = (this.state.isVisible) ? "text" : "password" ;
		const className = (this.state.isVisible) ? "active-btn" : "inactive-btn";
		const icon = (this.state.isVisible) ? <i className="fas fa-eye-slash"/> : <i className="fas fa-eye"/>;
		return (<span>
			<input
				type={type}
				name={this.props.name}
				placeholder={this.props.placeholder}
				onChange={this.props.onChange}
			/>
			<button
				onClick={this.handleClick}
				className={className}
				type="button"
			>
				{icon}
			</button>
		</span>);

	}
}

SeePassword.propTypes = {
	name : PropTypes.string,
	placeholder : PropTypes.string,
	onChange : PropTypes.string
};
