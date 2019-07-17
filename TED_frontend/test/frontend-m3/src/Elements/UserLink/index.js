import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

export default class UserLink extends Component {
	render() {
		return <NavLink to={`/profile/${this.props.user.userName}`} onClick={this.props.onClick}>
			<span className="full-name">
				{this.props.user.userName}
			</span>
		</NavLink>;
	}
}


UserLink.propTypes = {
	user: PropTypes.shape({
		userName: PropTypes.string
	}),
	onClick: PropTypes.func
};
