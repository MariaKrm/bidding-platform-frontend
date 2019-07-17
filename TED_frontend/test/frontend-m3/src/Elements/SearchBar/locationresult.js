import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";


export default class LocationResult extends Component {
	constructor(props) {
		super(props);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
	}
	
	handleMouseEnter() {
		this.props.setActive(this.props.index);
	}
	
	
	render() {
		const { result } = this.props;
		return <NavLink
			to={`/location?location=${result.locationTitle}`}
			className={"search-result "+this.props.className}
			onMouseEnter={this.handleMouseEnter}
		>
			<div className="location-info">
				<i className="fas fa-map-marker-alt"/>
				<span className="location-name">{result.locationTitle}</span>
			</div>
			<div className="location-stat">
				Posts: {result.nPosts}
			</div>
		</NavLink>;
	}
}

LocationResult.propTypes = {
	result: PropTypes.object.isRequired,
	className: PropTypes.string,
	setActive: PropTypes.func.isRequired,
	index: PropTypes.number.isRequired
};
