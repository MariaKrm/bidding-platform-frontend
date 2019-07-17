import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";


export default class UserResult extends Component {
	constructor(props) {
		super(props);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
	}
 
	handleMouseEnter() {
		this.props.setActive(this.props.index);
	}
 
	render() {
		const { result } = this.props;
		const imgPath = result.imgPath || process.env.PUBLIC_URL+"/images/profile-placeholder.png";
		return <NavLink
			to={`/profile/${result.userName}`}
			className={"search-result "+this.props.className}
			onClick={this.props.onClick}
			onMouseEnter={this.handleMouseEnter}>
			<div className="user-info">
				<img className="avatar" src={imgPath} alt={`${result.userName}'s avatar`}/>
				<div>
					<span className="username">{result.userName}</span>
					<span className="name">{result.firstName + " " + result.lastName}</span>
				</div>
			</div>
			<div className="user-stat">
				<span className='following'>following: {result.following}</span>
				<span className='followers'>followers: {result.followers}</span>
			</div>
		</NavLink>;
	}
}

UserResult.propTypes = {
	result: PropTypes.object.isRequired,
	className: PropTypes.string,
	onClick: PropTypes.func.isRequired,
	setActive: PropTypes.func.isRequired,
	index: PropTypes.number.isRequired
};
