import React, { Component } from "react";
import PropTypes from "prop-types";


export default class Header extends Component {
	render() {
		return <div className='header'>
			<h2>{this.props.title}</h2>
			<p>{this.props.description}</p>
		</div>;
	}
}

Header.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string
};
