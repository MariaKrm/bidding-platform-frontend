import React, { Component } from "react";
import PropTypes from "prop-types";

export default class VisibilitySetting extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.props.updateFields({ privateProfile: event.target.checked });
	}

	render() {
		return <div className="visibility-profile">
			<span>Private profile</span>
			<label className="switch">
				<input type="checkbox" defaultChecked={this.props.isPrivate} onInput={this.handleChange}/>
				<span className="slider round"/>
			</label>
		</div>;
	}
}



VisibilitySetting.propTypes = {
	updateFields: PropTypes.func.isRequired,
	isPrivate: PropTypes.bool
};
