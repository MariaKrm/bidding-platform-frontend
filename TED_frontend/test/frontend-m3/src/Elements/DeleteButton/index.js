import React, { Component } from "react";
import PropTypes from "prop-types";

export default class DeleteButton extends Component {
	render() {
		return <button className={"delete-btn"} onClick={this.props.handleDelete}><i className="fas fa-times-circle"/></button>;
	}
}

DeleteButton.propTypes = {
	handleDelete: PropTypes.func.isRequired
};

