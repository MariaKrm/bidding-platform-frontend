import React, { Component } from "react";
import PropTypes from "prop-types";


export default class PostResult extends Component {
	render() {
		return <span>A Simple Post</span>;
	}
}

PostResult.propTypes = {
	post: PropTypes.object.isRequired
};
