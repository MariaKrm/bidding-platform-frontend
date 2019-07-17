import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Submit extends Component {
	render() {
		if (this.props.enabled) {
			return <input type='submit' value={this.props.value}/>;
		}
		return <input disabled type='submit' value={this.props.value}/>;
	}
}

Submit.propTypes = {
	enabled: PropTypes.bool,
	value: PropTypes.string
};
